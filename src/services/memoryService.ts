import { supabase } from '../utils/supabase';
import { ApiError } from '../utils/apiError';
import logger from '../utils/logger';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface UploadOptions {
  collection_id?: string;
  taken_at?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

interface SearchOptions {
  query?: string;
  tags?: string[];
  people?: string[];
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  collectionId?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

interface UploadResult {
  batchId: string;
  memories: any[];
  failedUploads: any[];
  quotaRemaining: number;
}

export class MemoryService {
  async uploadMemories(
    userId: string,
    files: Express.Multer.File[],
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      // Check user's storage quota
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('storage_quota_mb')
        .eq('id', userId)
        .single();
      
      if (userError) {
        throw new ApiError(404, 'User not found');
      }
      
      // Calculate total file size in MB
      const totalSizeMB = files.reduce((sum, file) => sum + file.size / (1024 * 1024), 0);
      
      // Get current storage usage
      const { data: usageData, error: usageError } = await supabase
        .from('memories')
        .select('file_size')
        .eq('user_id', userId);
      
      if (usageError) {
        throw new ApiError(500, 'Failed to check storage usage');
      }
      
      const currentUsageMB = usageData.reduce((sum, memory) => sum + (memory.file_size || 0) / (1024 * 1024), 0);
      
      // Check if upload would exceed quota
      if (currentUsageMB + totalSizeMB > user.storage_quota_mb) {
        throw new ApiError(400, 'Storage quota exceeded');
      }
      
      // Generate batch ID
      const batchId = uuidv4();
      
      // Process each file
      const memories = [];
      const failedUploads = [];
      
      for (const file of files) {
        try {
          // Process image
          const { optimizedBuffer, thumbnailBuffer, dimensions } = await this.processImage(file.buffer);
          
          // Generate unique filename
          const filename = `${userId}/${uuidv4()}${path.extname(file.originalname)}`;
          const thumbnailFilename = `${userId}/thumbnails/${uuidv4()}${path.extname(file.originalname)}`;
          
          // Upload to storage
          const { data: fileData, error: fileError } = await supabase.storage
            .from('memory_media')
            .upload(filename, optimizedBuffer, {
              contentType: file.mimetype,
              upsert: false
            });
          
          if (fileError) {
            throw new Error(`Failed to upload file: ${fileError.message}`);
          }
          
          // Upload thumbnail
          const { data: thumbnailData, error: thumbnailError } = await supabase.storage
            .from('memory_media')
            .upload(thumbnailFilename, thumbnailBuffer, {
              contentType: file.mimetype,
              upsert: false
            });
          
          if (thumbnailError) {
            throw new Error(`Failed to upload thumbnail: ${thumbnailError.message}`);
          }
          
          // Get public URLs
          const { data: fileUrl } = supabase.storage
            .from('memory_media')
            .getPublicUrl(filename);
          
          const { data: thumbnailUrl } = supabase.storage
            .from('memory_media')
            .getPublicUrl(thumbnailFilename);
          
          // Create memory record
          const { data: memory, error: memoryError } = await supabase
            .from('memories')
            .insert({
              user_id: userId,
              image_url: fileUrl.publicUrl,
              thumbnail_url: thumbnailUrl.publicUrl,
              original_filename: file.originalname,
              file_size: file.size,
              image_dimensions: dimensions,
              taken_at: options.taken_at || new Date().toISOString(),
              location_data: options.location ? {
                lat: options.location.lat,
                lng: options.location.lng,
                address: options.location.address
              } : null,
              processing_status: 'pending',
              batch_id: batchId
            })
            .select()
            .single();
          
          if (memoryError) {
            throw new Error(`Failed to create memory record: ${memoryError.message}`);
          }
          
          // Add to collection if specified
          if (options.collection_id) {
            await supabase
              .from('memory_collections')
              .insert({
                memory_id: memory.id,
                collection_id: options.collection_id
              });
          }
          
          memories.push(memory);
        } catch (error) {
          logger.error(`Failed to process file ${file.originalname}:`, error);
          failedUploads.push({
            filename: file.originalname,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      // Calculate remaining quota
      const quotaRemaining = user.storage_quota_mb - (currentUsageMB + totalSizeMB);
      
      return {
        batchId,
        memories,
        failedUploads,
        quotaRemaining
      };
    } catch (error) {
      logger.error('Error uploading memories:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to upload memories');
    }
  }

  private async processImage(buffer: Buffer): Promise<{
    optimizedBuffer: Buffer;
    thumbnailBuffer: Buffer;
    dimensions: { width: number; height: number };
  }> {
    try {
      // Get image info
      const metadata = await sharp(buffer).metadata();
      
      // Resize and optimize image if needed
      let optimizedBuffer = buffer;
      if (metadata.width && metadata.width > 2000) {
        optimizedBuffer = await sharp(buffer)
          .resize(2000, null, { withoutEnlargement: true })
          .jpeg({ quality: Number(process.env.IMAGE_QUALITY) || 85 })
          .toBuffer();
      }
      
      // Create thumbnail
      const thumbnailSize = Number(process.env.THUMBNAIL_SIZE) || 300;
      const thumbnailBuffer = await sharp(buffer)
        .resize(thumbnailSize, thumbnailSize, { fit: 'cover' })
        .jpeg({ quality: 70 })
        .toBuffer();
      
      return {
        optimizedBuffer,
        thumbnailBuffer,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0
        }
      };
    } catch (error) {
      logger.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  async getMemoryById(memoryId: string, userId: string) {
    try {
      // Get memory
      const { data: memory, error } = await supabase
        .from('memories')
        .select(`
          *,
          tags (*)
        `)
        .eq('id', memoryId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        throw new ApiError(404, 'Memory not found');
      }
      
      return memory;
    } catch (error) {
      logger.error('Error getting memory:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to get memory');
    }
  }

  async searchMemories(userId: string, options: SearchOptions) {
    try {
      let query = supabase
        .from('memories')
        .select(`
          *,
          tags (*)
        `)
        .eq('user_id', userId);
      
      // Apply filters
      if (options.query) {
        query = query.or(`caption.ilike.%${options.query}%,ai_description.ilike.%${options.query}%`);
      }
      
      if (options.tags && options.tags.length > 0) {
        query = query.in('tags.tag_name', options.tags);
      }
      
      if (options.dateFrom) {
        query = query.gte('taken_at', options.dateFrom);
      }
      
      if (options.dateTo) {
        query = query.lte('taken_at', options.dateTo);
      }
      
      if (options.collectionId) {
        query = query.eq('memory_collections.collection_id', options.collectionId);
      }
      
      // Apply sorting
      if (options.sort) {
        query = query.order(options.sort, { ascending: options.order === 'asc' });
      } else {
        query = query.order('taken_at', { ascending: false });
      }
      
      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }
      
      // Execute query
      const { data: memories, error, count } = await query;
      
      if (error) {
        throw new Error(`Failed to search memories: ${error.message}`);
      }
      
      // Get search suggestions
      const suggestions = await this.getSearchSuggestions(userId, options.query);
      
      return {
        memories,
        total_count: count || 0,
        search_suggestions: suggestions,
        related_tags: this.extractRelatedTags(memories),
        related_people: this.extractRelatedPeople(memories)
      };
    } catch (error) {
      logger.error('Error searching memories:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to search memories');
    }
  }

  private getSearchSuggestions(userId: string, query?: string): Promise<string[]> {
    // This would be implemented with a more sophisticated algorithm in production
    // For now, return some static suggestions
    return Promise.resolve([
      'sunset mountains',
      'family vacation',
      'birthday celebration',
      'holiday gathering'
    ]);
  }

  private extractRelatedTags(memories: any[]): string[] {
    // Extract unique tags from memories
    const tags = new Set<string>();
    
    memories.forEach(memory => {
      if (memory.tags) {
        memory.tags.forEach((tag: any) => {
          tags.add(tag.tag_name);
        });
      }
    });
    
    return Array.from(tags);
  }

  private extractRelatedPeople(memories: any[]): string[] {
    // Extract unique people from memories
    const people = new Set<string>();
    
    memories.forEach(memory => {
      if (memory.tags) {
        memory.tags
          .filter((tag: any) => tag.tag_category === 'person')
          .forEach((tag: any) => {
            people.add(tag.tag_name);
          });
      }
    });
    
    return Array.from(people);
  }

  async updateMemory(memoryId: string, userId: string, updateData: any) {
    try {
      // Check if memory exists and belongs to user
      const { data: existingMemory, error: checkError } = await supabase
        .from('memories')
        .select('id')
        .eq('id', memoryId)
        .eq('user_id', userId)
        .single();
      
      if (checkError) {
        throw new ApiError(404, 'Memory not found');
      }
      
      // Update memory
      const { data: updatedMemory, error: updateError } = await supabase
        .from('memories')
        .update({
          caption: updateData.caption,
          taken_at: updateData.taken_at,
          location_data: updateData.location,
          privacy_level: updateData.privacy_level,
          updated_at: new Date().toISOString()
        })
        .eq('id', memoryId)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(`Failed to update memory: ${updateError.message}`);
      }
      
      // Update tags if provided
      if (updateData.tags) {
        // Delete existing tags
        await supabase
          .from('tags')
          .delete()
          .eq('memory_id', memoryId);
        
        // Insert new tags
        const tagInserts = updateData.tags.map((tag: string) => ({
          memory_id: memoryId,
          tag_name: tag,
          tag_category: 'user', // User-provided tag
          is_ai_generated: false,
          is_verified: true,
          created_by: userId
        }));
        
        await supabase
          .from('tags')
          .insert(tagInserts);
      }
      
      return updatedMemory;
    } catch (error) {
      logger.error('Error updating memory:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to update memory');
    }
  }

  async deleteMemory(memoryId: string, userId: string) {
    try {
      // Check if memory exists and belongs to user
      const { data: memory, error: checkError } = await supabase
        .from('memories')
        .select('id, image_url, thumbnail_url')
        .eq('id', memoryId)
        .eq('user_id', userId)
        .single();
      
      if (checkError) {
        throw new ApiError(404, 'Memory not found');
      }
      
      // Delete from storage
      if (memory.image_url) {
        const filename = memory.image_url.split('/').pop();
        await supabase.storage
          .from('memory_media')
          .remove([`${userId}/${filename}`]);
      }
      
      if (memory.thumbnail_url) {
        const thumbnailFilename = memory.thumbnail_url.split('/').pop();
        await supabase.storage
          .from('memory_media')
          .remove([`${userId}/thumbnails/${thumbnailFilename}`]);
      }
      
      // Delete memory record (this will cascade delete tags and other related records)
      const { error: deleteError } = await supabase
        .from('memories')
        .delete()
        .eq('id', memoryId);
      
      if (deleteError) {
        throw new Error(`Failed to delete memory: ${deleteError.message}`);
      }
      
      return true;
    } catch (error) {
      logger.error('Error deleting memory:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to delete memory');
    }
  }

  async getMemoryTags(memoryId: string, userId: string) {
    try {
      // Check if memory exists and belongs to user
      const { data: memory, error: checkError } = await supabase
        .from('memories')
        .select('id')
        .eq('id', memoryId)
        .eq('user_id', userId)
        .single();
      
      if (checkError) {
        throw new ApiError(404, 'Memory not found');
      }
      
      // Get tags
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('memory_id', memoryId);
      
      if (tagsError) {
        throw new Error(`Failed to get tags: ${tagsError.message}`);
      }
      
      return tags;
    } catch (error) {
      logger.error('Error getting memory tags:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Failed to get memory tags');
    }
  }
}