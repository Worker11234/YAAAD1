import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../services/supabaseService';
import imageProcessingService from '../services/imageProcessingService';
import { logger } from '../utils/logger';

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
  const autoTag = req.body.auto_tag !== 'false';
  const detectFaces = req.body.detect_faces !== 'false';
  const extractText = req.body.extract_text === 'true';

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('storage_quota_mb')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    throw new AppError('Failed to retrieve user data', 500);
  }

  const totalFileSize = req.files.reduce((sum, file) => sum + file.size, 0);
  const totalFileSizeMB = totalFileSize / (1024 * 1024);

  const { data: usageData } = await supabase.rpc('get_user_storage_usage', { user_id: userId });
  const currentUsageMB = usageData?.usage_mb || 0;
  const quotaMB = userData.storage_quota_mb;

  if (currentUsageMB + totalFileSizeMB > quotaMB) {
    throw new AppError('Storage quota exceeded', 400);
  }

  const batchId = crypto.randomUUID();
  const processedMemories = [];
  const failedUploads = [];

  for (const file of req.files) {
    try {
      const { image, thumbnail } = await imageProcessingService.uploadImageWithThumbnail(
        userId,
        file.buffer,
        file.originalname
      );

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
          processing_status: 'pending',
          ...(collectionId && { collection_id: collectionId })
        })
        .select()
        .single();

      if (memoryError) {
        throw new Error(`Failed to create memory record: ${memoryError.message}`);
      }

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
