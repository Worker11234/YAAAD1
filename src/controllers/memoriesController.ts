import { Request, Response, NextFunction } from 'express';
import { imageAnalysisQueue } from '../queues';
import { imageService } from '../services/imageService';
import { db } from '../services/supabase';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

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

      // Get memories from database
      const memories = await db.query('memories', query => 
        query
          .select('*, tags(*)')
          .eq('user_id', userId)
          .order(sortBy, { ascending: sortOrder === 'asc' })
          .range(offset, offset + limit - 1)
      );

      // Get total count
      const { count, error: countError } = await db.supabase
        .from('memories')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw new AppError('Failed to get memory count', 500);
      }

      res.json({
        success: true,
        data: {
          memories,
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

      // Get memory with related data
      const memory = await db.query('memories', query => 
        query
          .select(`
            *,
            tags(*),
            face_detections(*, people(*))
          `)
          .eq('id', memoryId)
          .eq('user_id', userId)
          .single()
      );

      if (!memory || memory.length === 0) {
        throw new AppError('Memory not found', 404);
      }

      res.json({
        success: true,
        data: memory[0]
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
      const limit = parseInt(req.query.limit as string || '20', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);

      // Build query
      let memoriesQuery = db.supabase
        .from('memories')
        .select(`
          *,
          tags(*),
          face_detections!inner(*, people!inner(*))
        `)
        .eq('user_id', userId);

      // Apply filters
      if (query) {
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

      if (location) {
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

      // Parse request body
      const collectionId = req.body.collection_id;
      const takenAt = req.body.taken_at || new Date().toISOString();
      const location = req.body.location;
      const autoTag = req.body.auto_tag !== 'false';
      const detectFaces = req.body.detect_faces !== 'false';
      const extractText = req.body.extract_text === 'true';
      const privacyLevel = req.body.privacy_level || 'private';

      // Process each file
      const results = [];
      const failedUploads = [];

      for (const file of files) {
        try {
          // Validate file
          imageService.validateImage(file);

          // Process image
          const { optimizedBuffer, thumbnailBuffer, metadata } = await imageService.processImage(file);

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
          const memory = await db.insert('memories', {
            user_id: userId,
            image_url: imageUrl,
            thumbnail_url: thumbnailUrl,
            original_filename: file.originalname,
            file_size: file.size,
            image_dimensions: {
              width: metadata.width,
              height: metadata.height,
              format: metadata.format
            },
            taken_at: takenAt,
            location_data: location,
            privacy_level: privacyLevel,
            processing_status: 'pending'
          });

          // Add to collection if specified
          if (collectionId) {
            await db.insert('memory_collections', {
              memory_id: memory.id,
              collection_id: collectionId
            });
          }

          // Save temp file for processing
          const tempFilePath = await imageService.saveTempFile(file.buffer);

          // Add to image analysis queue
          await imageAnalysisQueue.add(
            'analyze-image',
            {
              memoryId: memory.id,
              userId,
              filePath: tempFilePath
            },
            {
              priority: 1,
              attempts: 3,
              removeOnComplete: true
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
      const { data: user } = await db.supabase
        .from('users')
        .select('storage_quota_mb')
        .eq('id', userId)
        .single();

      const quotaRemaining = user?.storage_quota_mb || 0;

      res.status(202).json({
        success: true,
        data: {
          batch_id: Date.now().toString(),
          memories: results,
          failed_uploads: failedUploads,
          quota_remaining_mb: quotaRemaining
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

      // Check if memory exists and belongs to user
      const memory = await db.getById('memories', memoryId);
      if (!memory) {
        throw new AppError('Memory not found', 404);
      }

      if (memory.user_id !== userId) {
        throw new AppError('Not authorized to update this memory', 403);
      }

      // Update memory
      const updatedMemory = await db.update('memories', memoryId, req.body);

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

      // Check if memory exists and belongs to user
      const memory = await db.getById('memories', memoryId);
      if (!memory) {
        throw new AppError('Memory not found', 404);
      }

      if (memory.user_id !== userId) {
        throw new AppError('Not authorized to delete this memory', 403);
      }

      // Delete memory
      await db.delete('memories', memoryId);

      // Delete associated files from storage
      // Extract file paths from URLs
      const imageUrl = memory.image_url;
      const thumbnailUrl = memory.thumbnail_url;

      if (imageUrl) {
        const imagePath = new URL(imageUrl).pathname.split('/').pop();
        if (imagePath) {
          await db.supabase.storage
            .from('memory_media')
            .remove([`${userId}/${imagePath}`]);
        }
      }

      if (thumbnailUrl) {
        const thumbnailPath = new URL(thumbnailUrl).pathname.split('/').pop();
        if (thumbnailPath) {
          await db.supabase.storage
            .from('memory_media')
            .remove([`${userId}/${thumbnailPath}`]);
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
      const { count: totalCount, error: countError } = await db.supabase
        .from('memories')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw new AppError('Failed to get memory count', 500);
      }

      // Get counts by type
      const { data: typeCounts, error: typeError } = await db.supabase
        .from('memories')
        .select('memory_type, count(*)')
        .eq('user_id', userId)
        .group('memory_type');

      if (typeError) {
        throw new AppError('Failed to get memory type counts', 500);
      }

      // Get counts by month
      const { data: monthCounts, error: monthError } = await db.supabase
        .from('memories')
        .select('date_trunc(\'month\', taken_at) as month, count(*)')
        .eq('user_id', userId)
        .group('month')
        .order('month', { ascending: false });

      if (monthError) {
        throw new AppError('Failed to get memory month counts', 500);
      }

      // Get top tags
      const { data: topTags, error: tagsError } = await db.supabase
        .from('tags')
        .select('tag_name, count(*)')
        .eq('created_by', userId)
        .group('tag_name')
        .order('count', { ascending: false })
        .limit(10);

      if (tagsError) {
        throw new AppError('Failed to get top tags', 500);
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
      const limit = parseInt(req.query.limit as string || '20', 10);
      const cursor = req.query.cursor as string;
      const quality = req.query.quality as string || 'medium';

      // Determine which fields to select based on quality
      let select = '*';
      if (quality === 'low') {
        select = 'id, thumbnail_url, caption, taken_at';
      }

      // Build query
      let query = db.supabase
        .from('memories')
        .select(select)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Apply cursor pagination if provided
      if (cursor) {
        const { data: cursorMemory } = await db.supabase
          .from('memories')
          .select('created_at')
          .eq('id', cursor)
          .single();

        if (cursorMemory) {
          query = query.lt('created_at', cursorMemory.created_at);
        }
      }

      // Execute query
      const { data: memories, error } = await query;

      if (error) {
        throw new AppError(`Failed to get memories: ${error.message}`, 500);
      }

      // Determine next cursor
      const nextCursor = memories && memories.length === limit ? memories[memories.length - 1].id : null;

      res.json({
        success: true,
        data: {
          memories: memories || [],
          next_cursor: nextCursor
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper methods
  private async generateSearchSuggestions(query: string): Promise<string[]> {
    // In a real implementation, this would use AI or analytics to generate suggestions
    // For this example, we'll return some static suggestions
    return [
      `${query} family photos`,
      `${query} vacation`,
      `${query} with friends`,
      `${query} celebration`,
      `${query} holiday`
    ];
  }

  private async getRelatedTags(userId: string, selectedTags: string[]): Promise<string[]> {
    try {
      if (selectedTags.length === 0) {
        // Get most popular tags
        const { data } = await db.supabase
          .from('tags')
          .select('tag_name, count(*)')
          .eq('created_by', userId)
          .group('tag_name')
          .order('count', { ascending: false })
          .limit(10);

        return data?.map(tag => tag.tag_name) || [];
      } else {
        // Get co-occurring tags
        const { data } = await db.supabase
          .from('tags')
          .select('tag_name, count(*)')
          .eq('created_by', userId)
          .not('tag_name', 'in', `(${selectedTags.join(',')})`)
          .in('memory_id', db.supabase
            .from('tags')
            .select('memory_id')
            .in('tag_name', selectedTags)
          )
          .group('tag_name')
          .order('count', { ascending: false })
          .limit(10);

        return data?.map(tag => tag.tag_name) || [];
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
        const { data } = await db.supabase
          .from('people')
          .select('name')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        return data?.map(person => person.name) || [];
      } else {
        // Get people who appear in the same photos
        const { data } = await db.supabase
          .from('people')
          .select('name')
          .eq('user_id', userId)
          .not('name', 'in', `(${selectedPeople.join(',')})`)
          .in('id', db.supabase
            .from('face_detections')
            .select('person_id')
            .in('memory_id', db.supabase
              .from('face_detections')
              .select('memory_id')
              .in('person_id', db.supabase
                .from('people')
                .select('id')
                .in('name', selectedPeople)
              )
            )
          )
          .limit(10);

        return data?.map(person => person.name) || [];
      }
    } catch (error) {
      logger.error('Error getting related people:', error);
      return [];
    }
  }
}