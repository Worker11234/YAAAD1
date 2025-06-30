import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { imageAnalysisQueue } from '../queues';
import { imageService } from '../services/imageService';
import { supabase } from '../services/supabase'; // Removed 'db' import since it's not used
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Removed InsertedMemory interface since it's not used

interface NewMemoryInput {
  user_id: string;
  image_url: string;
  thumbnail_url: string;
  original_filename: string;
  file_size: number;
  image_dimensions: {
    width: number;
    height: number;
    format: string;
  };
  taken_at: string;
  location_data: any;
  privacy_level: string;
  processing_status: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
}

interface ProcessedImageData {
  optimizedBuffer: Buffer;
  thumbnailBuffer: Buffer;
  metadata: sharp.Metadata;
}

interface UploadResult {
  id: string;
  image_url: string;
  thumbnail_url: string;
  processing_status: string;
}

interface FailedUpload {
  filename: string;
  error: string;
}

interface DatabaseMemory {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url: string;
  original_filename: string;
  file_size: number;
  image_dimensions: any;
  taken_at: string;
  location_data: any;
  privacy_level: string;
  processing_status: string;
  created_at: string;
  updated_at: string;
  caption?: string;
  ai_description?: string;
}

// Helper function to validate and extract metadata
function extractImageMetadata(metadata: sharp.Metadata): ImageMetadata {
  if (!metadata.width || !metadata.height || !metadata.format) {
    throw new AppError('Unable to extract complete image metadata', 400);
  }
  
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format
  };
}

export class MemoriesController {
  // Get all memories for the authenticated user
  async getMemories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Parse query parameters
      const limit = parseInt(req.query.limit as string || '20', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);
      const sortBy = req.query.sort_by as string || 'created_at';
      const sortOrder = req.query.sort_order as string || 'desc';

      // Validate pagination parameters
      if (limit > 100) {
        throw new AppError('Limit cannot exceed 100', 400);
      }
      if (offset < 0) {
        throw new AppError('Offset cannot be negative', 400);
      }

      // Get memories from database using Supabase directly for better type safety
      const { data: memories, error } = await supabase
        .from('memories')
        .select(`
          *,
          tags(*)
        `)
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new AppError(`Failed to fetch memories: ${error.message}`, 500);
      }

      // Get total count
      const { count, error: countError } = await supabase
        .from('memories')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw new AppError('Failed to get memory count', 500);
      }

      res.json({
        success: true,
        data: {
          memories: memories || [],
          total: count || 0,
          limit,
          offset
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single memory by ID
  async getMemoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const memoryId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (!memoryId) {
        throw new AppError('Memory ID is required', 400);
      }

      // Get memory with related data using Supabase directly
      const { data: memory, error } = await supabase
        .from('memories')
        .select(`
          *,
          tags(*),
          face_detections(*, people(*))
        `)
        .eq('id', memoryId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Memory not found', 404);
        }
        throw new AppError(`Failed to fetch memory: ${error.message}`, 500);
      }

      if (!memory) {
        throw new AppError('Memory not found', 404);
      }

      res.json({
        success: true,
        data: memory
      });
    } catch (error) {
      next(error);
    }
  }

  // Search memories with advanced filters
  async searchMemories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Parse query parameters
      const query = req.query.q as string;
      const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
      const people = req.query.people ? (req.query.people as string).split(',') : [];
      const dateFrom = req.query.date_from as string;
      const dateTo = req.query.date_to as string;
      const location = req.query.location as string;
      const collectionId = req.query.collection_id as string;
      const sort = req.query.sort as string || 'date';
      const limit = Math.min(parseInt(req.query.limit as string || '20', 10), 100);
      const offset = Math.max(parseInt(req.query.offset as string || '0', 10), 0);

      // Build query
      let memoriesQuery = supabase
        .from('memories')
        .select(`
          *,
          tags(*),
          face_detections!inner(*, people!inner(*))
        `)
        .eq('user_id', userId);

      // Apply filters
      if (query && query.trim()) {
        memoriesQuery = memoriesQuery.or(`caption.ilike.%${query}%,ai_description.ilike.%${query}%`);
      }

      if (tags.length > 0) {
        memoriesQuery = memoriesQuery.in('tags.tag_name', tags);
      }

      if (people.length > 0) {
        memoriesQuery = memoriesQuery.in('face_detections.people.name', people);
      }

      if (dateFrom) {
        memoriesQuery = memoriesQuery.gte('taken_at', dateFrom);
      }

      if (dateTo) {
        memoriesQuery = memoriesQuery.lte('taken_at', dateTo);
      }

      if (location && location.trim()) {
        memoriesQuery = memoriesQuery.ilike('location_data->>address', `%${location}%`);
      }

      if (collectionId) {
        memoriesQuery = memoriesQuery.eq('memory_collections.collection_id', collectionId);
      }

      // Apply sorting
      switch (sort) {
        case 'relevance':
          // For relevance sorting, we would need a more complex query with scoring
          // This is a simplified version
          memoriesQuery = memoriesQuery.order('created_at', { ascending: false });
          break;
        case 'date':
          memoriesQuery = memoriesQuery.order('taken_at', { ascending: false });
          break;
        case 'popularity':
          // This would require a join or a view with popularity metrics
          memoriesQuery = memoriesQuery.order('created_at', { ascending: false });
          break;
        default:
          memoriesQuery = memoriesQuery.order('created_at', { ascending: false });
      }

      // Apply pagination
      memoriesQuery = memoriesQuery.range(offset, offset + limit - 1);

      // Execute query
      const { data: memories, error, count } = await memoriesQuery;

      if (error) {
        throw new AppError(`Failed to search memories: ${error.message}`, 500);
      }

      // Get search suggestions
      const searchSuggestions = query ? await this.generateSearchSuggestions(query) : [];

      // Get related tags
      const relatedTags = await this.getRelatedTags(userId, tags);

      // Get related people
      const relatedPeople = await this.getRelatedPeople(userId, people);

      res.json({
        success: true,
        data: {
          memories: memories || [],
          total_count: count || 0,
          search_suggestions: searchSuggestions,
          related_tags: relatedTags,
          related_people: relatedPeople
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Upload and analyze new memories
  async analyzeMemories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError('No files uploaded', 400);
      }

      // Validate file count
      if (files.length > 10) {
        throw new AppError('Maximum 10 files can be uploaded at once', 400);
      }

      // Parse request body
      const collectionId = req.body.collection_id;
      const takenAt = req.body.taken_at || new Date().toISOString();
      const location = req.body.location;
      const autoTag = req.body.auto_tag !== 'false';
      const detectFaces = req.body.detect_faces !== 'false';
      const extractText = req.body.extract_text === 'true';
      const privacyLevel = req.body.privacy_level || 'private';

      // Validate privacy level
      const validPrivacyLevels = ['private', 'friends', 'public'];
      if (!validPrivacyLevels.includes(privacyLevel)) {
        throw new AppError('Invalid privacy level', 400);
      }

      // Process each file
      const results: UploadResult[] = [];
      const failedUploads: FailedUpload[] = [];

      for (const file of files) {
        try {
          // Validate file
          imageService.validateImage(file);

          // Process image
          const { optimizedBuffer, thumbnailBuffer, metadata }: ProcessedImageData = 
            await imageService.processImage(file);

          // Extract and validate metadata
          const imageMetadata = extractImageMetadata(metadata);

          // Upload to storage
          const imageUrl = await imageService.uploadToStorage(
            userId,
            optimizedBuffer,
            file.originalname,
            file.mimetype
          );

          const thumbnailUrl = await imageService.uploadToStorage(
            userId,
            thumbnailBuffer,
            `thumb_${file.originalname}`,
            'image/jpeg',
            'memory_media'
          );

          // Create memory record
          const newMemoryData: NewMemoryInput = {
            user_id: userId,
            image_url: imageUrl,
            thumbnail_url: thumbnailUrl,
            original_filename: file.originalname,
            file_size: file.size,
            image_dimensions: imageMetadata,
            taken_at: takenAt,
            location_data: location,
            privacy_level: privacyLevel,
            processing_status: 'pending'
          };

          // Insert memory using Supabase directly for better error handling
          const { data: memory, error: insertError } = await supabase
            .from('memories')
            .insert(newMemoryData)
            .select()
            .single();

          if (insertError) {
            throw new AppError(`Failed to create memory record: ${insertError.message}`, 500);
          }

          if (!memory) {
            throw new AppError('Failed to create memory record', 500);
          }

          // Add to collection if specified
          if (collectionId) {
            const { error: collectionError } = await supabase
              .from('memory_collections')
              .insert({
                memory_id: memory.id,
                collection_id: collectionId
              });

            if (collectionError) {
              logger.warn(`Failed to add memory to collection: ${collectionError.message}`);
            }
          }

          // Save temp file for processing
          const tempFilePath = await imageService.saveTempFile(file.buffer);

          // Add to image analysis queue
          await imageAnalysisQueue.add(
            'analyze-image',
            {
              memoryId: memory.id,
              userId,
              filePath: tempFilePath,
              options: {
                autoTag,
                detectFaces,
                extractText
              }
            },
            {
              priority: 1,
              attempts: 3,
              removeOnComplete: true,
              backoff: {
                type: 'exponential',
                delay: 2000
              }
            }
          );

          results.push({
            id: memory.id,
            image_url: imageUrl,
            thumbnail_url: thumbnailUrl,
            processing_status: 'pending'
          });
        } catch (error) {
          logger.error(`Failed to process file ${file.originalname}:`, error);
          failedUploads.push({
            filename: file.originalname,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Get remaining storage quota
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('storage_quota_mb')
        .eq('id', userId)
        .single();

      if (userError) {
        logger.warn('Failed to get user storage quota:', userError);
      }

      const quotaRemaining = user?.storage_quota_mb || 0;

      res.status(202).json({
        success: true,
        data: {
          batch_id: Date.now().toString(),
          memories: results,
          failed_uploads: failedUploads,
          quota_remaining_mb: quotaRemaining,
          processed_count: results.length,
          failed_count: failedUploads.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update memory details
  async updateMemory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const memoryId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (!memoryId) {
        throw new AppError('Memory ID is required', 400);
      }

      // Check if memory exists and belongs to user
      const { data: memory, error: fetchError } = await supabase
        .from('memories')
        .select('id, user_id')
        .eq('id', memoryId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Memory not found', 404);
        }
        throw new AppError(`Failed to fetch memory: ${fetchError.message}`, 500);
      }

      if (!memory || memory.user_id !== userId) {
        throw new AppError('Not authorized to update this memory', 403);
      }

      // Validate update data
      const allowedFields = ['caption', 'privacy_level', 'location_data', 'taken_at'];
      const updateData: any = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new AppError('No valid fields to update', 400);
      }

      // Validate privacy level if provided
      if (updateData.privacy_level) {
        const validPrivacyLevels = ['private', 'friends', 'public'];
        if (!validPrivacyLevels.includes(updateData.privacy_level)) {
          throw new AppError('Invalid privacy level', 400);
        }
      }

      // Update memory
      const { data: updatedMemory, error: updateError } = await supabase
        .from('memories')
        .update(updateData)
        .eq('id', memoryId)
        .select()
        .single();

      if (updateError) {
        throw new AppError(`Failed to update memory: ${updateError.message}`, 500);
      }

      res.json({
        success: true,
        data: updatedMemory
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a memory
  async deleteMemory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const memoryId = req.params.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (!memoryId) {
        throw new AppError('Memory ID is required', 400);
      }

      // Check if memory exists and belongs to user
      const { data: memory, error: fetchError } = await supabase
        .from('memories')
        .select('*')
        .eq('id', memoryId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new AppError('Memory not found', 404);
        }
        throw new AppError(`Failed to fetch memory: ${fetchError.message}`, 500);
      }

      if (!memory || memory.user_id !== userId) {
        throw new AppError('Not authorized to delete this memory', 403);
      }

      // Delete memory from database
      const { error: deleteError } = await supabase
        .from('memories')
        .delete()
        .eq('id', memoryId);

      if (deleteError) {
        throw new AppError(`Failed to delete memory: ${deleteError.message}`, 500);
      }

      // Delete associated files from storage
      const imageUrl = memory.image_url;
      const thumbnailUrl = memory.thumbnail_url;

      if (imageUrl) {
        try {
          const imagePath = new URL(imageUrl).pathname.split('/').pop();
          if (imagePath) {
            await supabase.storage
              .from('memory_media')
              .remove([`${userId}/${imagePath}`]);
          }
        } catch (error) {
          logger.warn('Failed to delete image file from storage:', error);
        }
      }

      if (thumbnailUrl) {
        try {
          const thumbnailPath = new URL(thumbnailUrl).pathname.split('/').pop();
          if (thumbnailPath) {
            await supabase.storage
              .from('memory_media')
              .remove([`${userId}/${thumbnailPath}`]);
          }
        } catch (error) {
          logger.warn('Failed to delete thumbnail file from storage:', error);
        }
      }

      res.json({
        success: true,
        message: 'Memory deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get memory statistics
  async getMemoryStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Get total count
      const { count: totalCount, error: countError } = await supabase
        .from('memories')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw new AppError('Failed to get memory count', 500);
      }

      // Get counts by type - using raw SQL for proper grouping
      const { data: typeCounts, error: typeError } = await supabase
        .rpc('get_memory_type_counts', { user_id: userId });

      if (typeError) {
        logger.warn('Failed to get memory type counts, using fallback', typeError);
      }

      // Get counts by month - using raw SQL for proper grouping
      const { data: monthCounts, error: monthError } = await supabase
        .rpc('get_memory_month_counts', { user_id: userId });

      if (monthError) {
        logger.warn('Failed to get memory month counts, using fallback', monthError);
      }

      // Get top tags - using raw SQL for proper grouping
      const { data: topTags, error: tagsError } = await supabase
        .rpc('get_top_tags', { user_id: userId, tag_limit: 10 });

      if (tagsError) {
        logger.warn('Failed to get top tags, using fallback', tagsError);
      }

      res.json({
        success: true,
        data: {
          total_memories: totalCount || 0,
          by_type: typeCounts || [],
          by_month: monthCounts || [],
          top_tags: topTags || []
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Mobile-optimized endpoint
  async getMobileMemories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      // Parse query parameters
      const limit = Math.min(parseInt(req.query.limit as string || '20', 10), 50);
      const cursor = req.query.cursor as string;
      const quality = req.query.quality as string || 'medium';

      // Determine which fields to select based on quality
      let select = '*';
      if (quality === 'low') {
        select = 'id, thumbnail_url, caption, taken_at, created_at';
      }

      // Build query
      let query = supabase
        .from('memories')
        .select(select)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Apply cursor pagination if provided
      if (cursor) {
        const { data: cursorMemory, error: cursorError } = await supabase
          .from('memories')
          .select('created_at')
          .eq('id', cursor)
          .single();

        if (cursorError) {
          logger.warn('Invalid cursor provided:', cursorError);
        } else if (cursorMemory) {
          query = query.lt('created_at', cursorMemory.created_at);
        }
      }

      // Execute query
      const { data: memories, error } = await query;

      if (error) {
        throw new AppError(`Failed to get memories: ${error.message}`, 500);
      }

      // Determine next cursor with proper type checking
      let nextCursor = null;
      if (memories && memories.length === limit) {
        const lastMemory = memories[memories.length - 1];
        // Check if the last memory has an id property before accessing it
        if (lastMemory && typeof lastMemory === 'object' && 'id' in lastMemory) {
          nextCursor = (lastMemory as DatabaseMemory).id;
        }
      }

      res.json({
        success: true,
        data: {
          memories: memories || [],
          next_cursor: nextCursor,
          has_more: memories ? memories.length === limit : false
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper methods
  private async generateSearchSuggestions(query: string): Promise<string[]> {
    try {
      // In a real implementation, this would use AI or analytics to generate suggestions
      // For this example, we'll return some static suggestions based on the query
      const suggestions = [
        `${query} family photos`,
        `${query} vacation`,
        `${query} with friends`,
        `${query} celebration`,
        `${query} holiday`
      ];
      
      return suggestions.filter(suggestion => suggestion.length <= 50);
    } catch (error) {
      logger.error('Error generating search suggestions:', error);
      return [];
    }
  }

  private async getRelatedTags(userId: string, selectedTags: string[]): Promise<string[]> {
    try {
      if (selectedTags.length === 0) {
        // Get most popular tags
        const { data, error } = await supabase
          .rpc('get_popular_tags', { user_id: userId, tag_limit: 10 });

        if (error) {
          logger.warn('Failed to get popular tags:', error);
          return [];
        }

        return data?.map((tag: any) => tag.tag_name) || [];
      } else {
        // Get co-occurring tags
        const { data, error } = await supabase
          .rpc('get_cooccurring_tags', { 
            user_id: userId, 
            selected_tags: selectedTags,
            tag_limit: 10 
          });

        if (error) {
          logger.warn('Failed to get co-occurring tags:', error);
          return [];
        }

        return data?.map((tag: any) => tag.tag_name) || [];
      }
    } catch (error) {
      logger.error('Error getting related tags:', error);
      return [];
    }
  }

  private async getRelatedPeople(userId: string, selectedPeople: string[]): Promise<string[]> {
    try {
      if (selectedPeople.length === 0) {
        // Get most frequently appearing people
        const { data, error } = await supabase
          .from('people')
          .select('name')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          logger.warn('Failed to get people:', error);
          return [];
        }

        return data?.map(person => person.name) || [];
      } else {
        // Get people who appear in the same photos
        const { data, error } = await supabase
          .rpc('get_cooccurring_people', {
            user_id: userId,
            selected_people: selectedPeople,
            people_limit: 10
          });

        if (error) {
          logger.warn('Failed to get co-occurring people:', error);
          return [];
        }

        return data?.map((person: any) => person.name) || [];
      }
    } catch (error) {
      logger.error('Error getting related people:', error);
      return [];
    }
  }
}