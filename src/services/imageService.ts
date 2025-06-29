import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { supabase } from './supabase';
import { AppError } from '../middleware/errorHandler';

export class ImageService {
  private thumbnailSize: number;
  private imageQuality: number;
  private allowedFileTypes: string[];

  constructor() {
    this.thumbnailSize = parseInt(process.env.THUMBNAIL_SIZE || '300', 10);
    this.imageQuality = parseInt(process.env.IMAGE_QUALITY || '85', 10);
    this.allowedFileTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
  }

  // Validate image file
  validateImage(file: Express.Multer.File): boolean {
    if (!file) {
      throw new AppError('No file provided', 400);
    }

    if (!this.allowedFileTypes.includes(file.mimetype)) {
      throw new AppError(`Invalid file type. Allowed types: ${this.allowedFileTypes.join(', ')}`, 400);
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB default
    if (file.size > maxSize) {
      throw new AppError(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`, 400);
    }

    return true;
  }

  // Process image and create thumbnail
  async processImage(file: Express.Multer.File): Promise<{
    optimizedBuffer: Buffer;
    thumbnailBuffer: Buffer;
    metadata: sharp.Metadata;
  }> {
    try {
      // Get image metadata
      const metadata = await sharp(file.buffer).metadata();
      
      // Create optimized version
      const optimizedBuffer = await sharp(file.buffer)
        .rotate() // Auto-rotate based on EXIF data
        .toFormat('jpeg', { quality: this.imageQuality })
        .toBuffer();
      
      // Create thumbnail
      const thumbnailBuffer = await sharp(file.buffer)
        .rotate()
        .resize(this.thumbnailSize, this.thumbnailSize, {
          fit: 'cover',
          position: 'centre'
        })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer();
      
      return {
        optimizedBuffer,
        thumbnailBuffer,
        metadata
      };
    } catch (error) {
      logger.error('Error processing image:', error);
      throw new AppError('Failed to process image', 500);
    }
  }

  // Upload image to Supabase Storage
  async uploadToStorage(
    userId: string,
    buffer: Buffer,
    fileName: string,
    contentType: string,
    bucket: string = 'memory_media'
  ): Promise<string> {
    try {
      // Generate unique file path
      const fileExt = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExt}`;
      const filePath = `${userId}/${uniqueFileName}`;
      
      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType,
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        logger.error('Error uploading to Supabase Storage:', error);
        throw new AppError('Failed to upload file to storage', 500);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      logger.error('Error in uploadToStorage:', error);
      throw new AppError('Failed to upload file to storage', 500);
    }
  }

  // Save temporary file for processing
  async saveTempFile(buffer: Buffer, extension: string = '.jpg'): Promise<string> {
    const tempDir = path.join(process.cwd(), 'temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempFilePath = path.join(tempDir, `${uuidv4()}${extension}`);
    
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFilePath, buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(tempFilePath);
        }
      });
    });
  }

  // Clean up temporary file
  async cleanupTempFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      logger.error('Error cleaning up temp file:', error);
    }
  }
}

// Export singleton instance
export const imageService = new ImageService();