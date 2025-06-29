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

  // Check if memory exists
  const { data: memory, error: memoryError } = await supabase
    .from('memories')
    .select('*')
    .eq('id', memoryId)
    .eq('user_id', userId)
    .single();

  if (memoryError || !memory) {
    throw new AppError('Memory not found', 404);
  }

  // Delete memory record
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', memoryId)
    .eq('user_id', userId);

  if (error) {
    throw new AppError(`Failed to delete memory: ${error.message}`, 500);
  }

  return res.status(200).json({
    success: true,
    message: 'Memory deleted successfully'
  });
});
