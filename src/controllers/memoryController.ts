import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../services/supabaseService';
import imageProcessingService from '../services/imageProcessingService';
import aiService from '../services/aiService';
import { logger } from '../utils/logger';
import { QueueType, JobType, addJob } from '../services/queueService';

export const analyzeMemories = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  const userId = req.user.id;
  const collectionId = req.body.collection_id;
  const takenAt = req.body.taken_at;
  const location = req.body.location;
  const autoTag = req.body.auto_tag !== 'false';
  const detectFaces = req.body.detect_faces !== 'false';
  const extractText = req.body.extract_text === 'true';

  // Check user's storage quota
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('storage_quota_mb')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    throw new AppError('Failed to retrieve user data', 500);
  }

  // Calculate total file size
  const totalFileSize = req.files.reduce((sum, file) => sum + file.size, 0);
  const totalFileSizeMB = totalFileSize / (1024 * 1024);

  // Check if upload exceeds quota
  const { data: usageData } = await supabase.rpc('get_user_storage_usage', { user_id: userId });
  const currentUsageMB = usageData?.usage_mb || 0;
  const quotaMB = userData.storage_quota_mb;

  if (currentUsageMB + totalFileSizeMB > quotaMB) {
    throw new AppError('Storage quota exceeded', 400);
  }

  // Process each file
  const batchId = crypto.randomUUID();
  const processedMemories = [];
  const failedUploads = [];

  for (const file of req.files) {
    try {
      // Process image and upload to storage
      const { image, thumbnail } = await imageProcessingService.uploadImageWithThumbnail(
        userId,
        file.buffer,
        file.originalname
      );

      // Create memory record in database
      const { data: memory, error: memoryError } = await supabase
        .from('memories')
        .insert({
          user_id: userId,
          image_url: image.url,
          thumbnail_url: thumbnail.url,
          original_filename: file.originalname,
          file_size: file.size,
          image_dimensions: { width: image.width, height: image.height },
          taken_at: takenAt || new Date().toISOString(),
          location_data: location || null,
          processing_status: 'pending',
          ...(collectionId && { collection_id: collectionId })
        })
        .select()
        .single();

      if (memoryError) {
        throw new Error(`Failed to create memory record: ${memoryError.message}`);
      }

      // Queue image analysis job
      await addJob(
        QueueType.IMAGE_ANALYSIS,
        JobType.ANALYZE_IMAGE,
        {
          memoryId: memory.id,
          userId,
          imageUrl: image.url,
          options: {
            autoTag,
            detectFaces,
            extractText
          }
        },
        { priority: 1 }
      );

      // Add to processed memories
      processedMemories.push({
        id: memory.id,
        image_url: image.url,
        thumbnail_url: thumbnail.url,
        processing_status: 'pending'
      });
    } catch (error) {
      logger.error(`Failed to process file ${file.originalname}:`, error);
      failedUploads.push({
        filename: file.originalname,
        error: (error as Error).message
      });
    }
  }

  // Return response
  return res.status(200).json({
    success: true,
    data: {
      batch_id: batchId,
      memories: processedMemories,
      failed_uploads: failedUploads,
      quota_remaining_mb: quotaMB - (currentUsageMB + totalFileSizeMB)
    }
  });
});

export const getMemories = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const limit = parseInt(req.query.limit as string || '20', 10);
  const offset = parseInt(req.query.offset as string || '0', 10);
  const collectionId = req.query.collection_id as string;

  // Build query
  let query = supabase
    .from('memories')
    .select(`
      *,
      tags (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Add collection filter if provided
  if (collectionId) {
    query = query.eq('collection_id', collectionId);
  }

  // Execute query
  const { data: memories, error, count } = await query;

  if (error) {
    throw new AppError(`Failed to retrieve memories: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: {
      memories,
      total: count || 0,
      limit,
      offset
    }
  });
});

export const getMemoryById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const memoryId = req.params.id;

  // Get memory with related data
  const { data: memory, error } = await supabase
    .from('memories')
    .select(`
      *,
      tags (*),
      face_detections (
        id,
        bounding_box,
        confidence,
        person_id,
        people (name, relationship)
      )
    `)
    .eq('id', memoryId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Memory not found', 404);
    }
    throw new AppError(`Failed to retrieve memory: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    data: memory
  });
});

export const deleteMemory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const memoryId = req.params.id;

  // Get memory to check ownership and get file paths
  const { data: memory, error: getError } = await supabase
    .from('memories')
    .select('id, image_url, thumbnail_url')
    .eq('id', memoryId)
    .eq('user_id', userId)
    .single();

  if (getError) {
    if (getError.code === 'PGRST116') {
      throw new AppError('Memory not found', 404);
    }
    throw new AppError(`Failed to retrieve memory: ${getError.message}`, 500);
  }

  // Delete memory record
  const { error: deleteError } = await supabase
    .from('memories')
    .delete()
    .eq('id', memoryId);

  if (deleteError) {
    throw new AppError(`Failed to delete memory: ${deleteError.message}`, 500);
  }

  // Delete files from storage
  // Note: This is handled by Supabase RLS and triggers in a production environment
  // Here we're just acknowledging the deletion

  return res.status(200).json({
    success: true,
    message: 'Memory deleted successfully'
  });
});

export const searchMemories = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const userId = req.user.id;
  const query = req.query.q as string;
  const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
  const people = req.query.people ? (req.query.people as string).split(',') : [];
  const dateFrom = req.query.date_from as string;
  const dateTo = req.query.date_to as string;
  const location = req.query.location as string;
  const collectionId = req.query.collection_id as string;
  const sort = (req.query.sort as string) || 'date';
  const limit = parseInt(req.query.limit as string || '20', 10);
  const offset = parseInt(req.query.offset as string || '0', 10);

  // Build search query
  // Note: In a real implementation, this would use Supabase's full-text search capabilities
  // or integrate with a dedicated search service like Algolia or Elasticsearch
  let searchQuery = supabase
    .from('memories')
    .select(`
      *,
      tags (*)
    `)
    .eq('user_id', userId);

  // Apply filters
  if (query) {
    searchQuery = searchQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (tags.length > 0) {
    // This is a simplified approach - in a real app, you'd use a more sophisticated query
    searchQuery = searchQuery.contains('tags', tags);
  }

  if (dateFrom) {
    searchQuery = searchQuery.gte('taken_at', dateFrom);
  }

  if (dateTo) {
    searchQuery = searchQuery.lte('taken_at', dateTo);
  }

  if (collectionId) {
    searchQuery = searchQuery.eq('collection_id', collectionId);
  }

  // Apply sorting
  if (sort === 'date') {
    searchQuery = searchQuery.order('taken_at', { ascending: false });
  } else if (sort === 'relevance') {
    // For relevance sorting, we'd need a more sophisticated approach
    // This is just a placeholder
    searchQuery = searchQuery.order('created_at', { ascending: false });
  }

  // Apply pagination
  searchQuery = searchQuery.range(offset, offset + limit - 1);

  // Execute query
  const { data: memories, error, count } = await searchQuery;

  if (error) {
    throw new AppError(`Search failed: ${error.message}`, 500);
  }

  // Generate search suggestions
  // In a real app, this would be based on user history and popular searches
  const searchSuggestions = query
    ? [
        `${query} family`,
        `${query} vacation`,
        `${query} birthday`,
        `${query} holiday`
      ]
    : [];

  return res.status(200).json({
    success: true,
    data: {
      memories,
      total: count || 0,
      limit,
      offset,
      search_suggestions: searchSuggestions,
      related_tags: [], // Would be populated in a real implementation
      related_people: [] // Would be populated in a real implementation
    }
  });
});