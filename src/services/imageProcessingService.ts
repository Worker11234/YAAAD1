import sharp from 'sharp';
import { logger } from '../utils/logger';
import { supabase } from './supabaseService';
import path from 'path';
import crypto from 'crypto';

interface ImageProcessingOptions {
  quality?: number;
  width?: number;
  height?: number;
  fit?: keyof sharp.FitEnum;
  format?: 'jpeg' | 'png' | 'webp';
}

interface ProcessedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  size: number;
}

interface UploadResult {
  url: string;
  path: string;
  size: number;
  format: string;
  width: number;
  height: number;
}

export class ImageProcessingService {
  private defaultOptions: ImageProcessingOptions = {
    quality: parseInt(process.env.IMAGE_QUALITY || '85', 10),
    format: 'jpeg'
  };

  private thumbnailSize = parseInt(process.env.THUMBNAIL_SIZE || '300', 10);

  /**
   * Process an image with the given options
   */
  async processImage(
    imageBuffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      const opts = { ...this.defaultOptions, ...options };
      
      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // Process image
      let processedImage = sharp(imageBuffer);
      
      // Resize if dimensions are provided
      if (opts.width || opts.height) {
        processedImage = processedImage.resize({
          width: opts.width,
          height: opts.height,
          fit: opts.fit || 'cover',
          withoutEnlargement: true
        });
      }
      
      // Convert to specified format
      if (opts.format) {
        switch (opts.format) {
          case 'jpeg':
            processedImage = processedImage.jpeg({ quality: opts.quality });
            break;
          case 'png':
            processedImage = processedImage.png();
            break;
          case 'webp':
            processedImage = processedImage.webp({ quality: opts.quality });
            break;
        }
      }
      
      // Get processed buffer
      const buffer = await processedImage.toBuffer();
      
      // Get final metadata
      const finalMetadata = await sharp(buffer).metadata();
      
      return {
        buffer,
        format: finalMetadata.format || 'unknown',
        width: finalMetadata.width || 0,
        height: finalMetadata.height || 0,
        size: buffer.length
      };
    } catch (error) {
      logger.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Generate a thumbnail from an image
   */
  async generateThumbnail(imageBuffer: Buffer): Promise<ProcessedImage> {
    return this.processImage(imageBuffer, {
      width: this.thumbnailSize,
      height: this.thumbnailSize,
      fit: 'cover',
      format: 'jpeg',
      quality: 80
    });
  }

  /**
   * Upload an image to Supabase storage
   */
  async uploadToStorage(
    userId: string,
    imageBuffer: Buffer,
    filename: string,
    bucket: string = 'memory_media'
  ): Promise<UploadResult> {
    try {
      // Process image to get metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // Generate a unique filename
      const ext = path.extname(filename) || `.${metadata.format}`;
      const uniqueFilename = `${userId}/${crypto.randomUUID()}${ext}`;
      
      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFilename, imageBuffer, {
          contentType: `image/${metadata.format}`,
          upsert: false
        });
      
      if (error) {
        logger.error('Error uploading to Supabase:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(uniqueFilename);
      
      return {
        url: urlData.publicUrl,
        path: uniqueFilename,
        size: imageBuffer.length,
        format: metadata.format || 'unknown',
        width: metadata.width || 0,
        height: metadata.height || 0
      };
    } catch (error) {
      logger.error('Error uploading image to storage:', error);
      throw new Error('Failed to upload image to storage');
    }
  }

  /**
   * Upload an image and its thumbnail
   */
  async uploadImageWithThumbnail(
    userId: string,
    imageBuffer: Buffer,
    filename: string
  ): Promise<{ image: UploadResult; thumbnail: UploadResult }> {
    try {
      // Generate thumbnail
      const thumbnailData = await this.generateThumbnail(imageBuffer);
      
      // Upload original image
      const image = await this.uploadToStorage(userId, imageBuffer, filename);
      
      // Upload thumbnail
      const thumbnailFilename = `thumbnail_${path.basename(filename)}`;
      const thumbnail = await this.uploadToStorage(
        userId,
        thumbnailData.buffer,
        thumbnailFilename
      );
      
      return { image, thumbnail };
    } catch (error) {
      logger.error('Error uploading image with thumbnail:', error);
      throw new Error('Failed to upload image with thumbnail');
    }
  }
}

export default new ImageProcessingService();