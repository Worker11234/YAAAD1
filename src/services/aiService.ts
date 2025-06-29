import axios from 'axios';
import { logger } from '../utils/logger';
import { getWithCache, setCache } from './cacheService';
import { QueueType, JobType, addJob } from './queueService';

interface AIModelConfig {
  name: string;
  endpoint: string;
  apiKey: string;
  provider: 'huggingface' | 'openai';
}

interface AIModels {
  captioning: AIModelConfig;
  objectDetection: AIModelConfig;
  faceDetection: AIModelConfig;
  textExtraction: AIModelConfig;
  sceneClassification: AIModelConfig;
  emotionDetection: AIModelConfig;
  tagGeneration: AIModelConfig;
}

interface AIAnalysisResult {
  caption?: string;
  objects?: Array<{ name: string; confidence: number; boundingBox?: any }>;
  faces?: Array<{ boundingBox: any; confidence: number; landmarks?: any }>;
  extractedText?: string[];
  scene?: { type: string; confidence: number };
  emotions?: Array<{ type: string; confidence: number }>;
  tags?: Array<{
    name: string;
    category: 'object' | 'person' | 'emotion' | 'activity' | 'location' | 'event';
    confidence: number;
    synonyms?: string[];
    related_tags?: string[];
  }>;
  processingTime: number;
}

export class AIService {
  private models: AIModels;
  
  constructor() {
    // Initialize AI models configuration
    this.models = {
      captioning: {
        name: 'Salesforce/blip-image-captioning-large',
        endpoint: `${process.env.HUGGINGFACE_API_URL}/Salesforce/blip-image-captioning-large`,
        apiKey: process.env.HUGGINGFACE_API_KEY || '',
        provider: 'huggingface'
      },
      objectDetection: {
        name: 'facebook/detr-resnet-50',
        endpoint: `${process.env.HUGGINGFACE_API_URL}/facebook/detr-resnet-50`,
        apiKey: process.env.HUGGINGFACE_API_KEY || '',
        provider: 'huggingface'
      },
      faceDetection: {
        name: 'face-detection',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: process.env.OPENAI_API_KEY || '',
        provider: 'openai'
      },
      textExtraction: {
        name: 'microsoft/trocr-base-printed',
        endpoint: `${process.env.HUGGINGFACE_API_URL}/microsoft/trocr-base-printed`,
        apiKey: process.env.HUGGINGFACE_API_KEY || '',
        provider: 'huggingface'
      },
      sceneClassification: {
        name: 'google/vit-base-patch16-224',
        endpoint: `${process.env.HUGGINGFACE_API_URL}/google/vit-base-patch16-224`,
        apiKey: process.env.HUGGINGFACE_API_KEY || '',
        provider: 'huggingface'
      },
      emotionDetection: {
        name: 'j-hartmann/emotion-english-distilroberta-base',
        endpoint: `${process.env.HUGGINGFACE_API_URL}/j-hartmann/emotion-english-distilroberta-base`,
        apiKey: process.env.HUGGINGFACE_API_KEY || '',
        provider: 'huggingface'
      },
      tagGeneration: {
        name: 'mistralai/Mistral-7B-Instruct-v0.1',
        endpoint: `${process.env.HUGGINGFACE_API_URL}/mistralai/Mistral-7B-Instruct-v0.1`,
        apiKey: process.env.HUGGINGFACE_API_KEY || '',
        provider: 'huggingface'
      }
    };
  }

  /**
   * Analyze an image using multiple AI models
   */
  async analyzeImage(
    imageBuffer: Buffer,
    options: {
      generateCaption?: boolean;
      detectObjects?: boolean;
      detectFaces?: boolean;
      extractText?: boolean;
      classifyScene?: boolean;
      detectEmotions?: boolean;
      generateTags?: boolean;
    } = {}
  ): Promise<AIAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Default all options to true if not specified
      const opts = {
        generateCaption: true,
        detectObjects: true,
        detectFaces: true,
        extractText: true,
        classifyScene: true,
        detectEmotions: true,
        generateTags: true,
        ...options
      };
      
      // Create a hash of the image for caching
      const imageHash = this.hashBuffer(imageBuffer);
      
      // Run analysis tasks in parallel
      const tasks: Promise<any>[] = [];
      
      if (opts.generateCaption) {
        tasks.push(this.generateCaption(imageBuffer, imageHash));
      } else {
        tasks.push(Promise.resolve(null));
      }
      
      if (opts.detectObjects) {
        tasks.push(this.detectObjects(imageBuffer, imageHash));
      } else {
        tasks.push(Promise.resolve(null));
      }
      
      if (opts.detectFaces) {
        tasks.push(this.detectFaces(imageBuffer, imageHash));
      } else {
        tasks.push(Promise.resolve(null));
      }
      
      if (opts.extractText) {
        tasks.push(this.extractText(imageBuffer, imageHash));
      } else {
        tasks.push(Promise.resolve(null));
      }
      
      if (opts.classifyScene) {
        tasks.push(this.classifyScene(imageBuffer, imageHash));
      } else {
        tasks.push(Promise.resolve(null));
      }
      
      // Wait for all tasks to complete
      const [caption, objects, faces, extractedText, scene] = await Promise.all(tasks);
      
      // Generate tags based on other results
      let tags = null;
      if (opts.generateTags) {
        tags = await this.generateTags(
          caption,
          objects?.map(o => o.name) || [],
          scene?.type || '',
          extractedText || []
        );
      }
      
      const processingTime = Date.now() - startTime;
      
      // Return combined results
      return {
        caption,
        objects,
        faces,
        extractedText,
        scene,
        tags,
        processingTime
      };
    } catch (error) {
      logger.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  /**
   * Generate a caption for an image
   */
  private async generateCaption(
    imageBuffer: Buffer,
    imageHash: string
  ): Promise<string | null> {
    const cacheKey = `caption:${imageHash}`;
    
    try {
      return await getWithCache<string>(
        cacheKey,
        async () => {
          // Queue the job for processing
          const job = await addJob(
            QueueType.IMAGE_ANALYSIS,
            JobType.GENERATE_CAPTION,
            { imageBuffer: imageBuffer.toString('base64') }
          );
          
          // Wait for job to complete
          const result = await job.finished();
          return result.caption;
        },
        86400 // 24 hours cache
      );
    } catch (error) {
      logger.error('Error generating caption:', error);
      return null;
    }
  }

  /**
   * Detect objects in an image
   */
  private async detectObjects(
    imageBuffer: Buffer,
    imageHash: string
  ): Promise<Array<{ name: string; confidence: number; boundingBox?: any }> | null> {
    const cacheKey = `objects:${imageHash}`;
    
    try {
      return await getWithCache<Array<{ name: string; confidence: number; boundingBox?: any }>>(
        cacheKey,
        async () => {
          // Queue the job for processing
          const job = await addJob(
            QueueType.IMAGE_ANALYSIS,
            JobType.DETECT_OBJECTS,
            { imageBuffer: imageBuffer.toString('base64') }
          );
          
          // Wait for job to complete
          const result = await job.finished();
          return result.objects;
        },
        86400 // 24 hours cache
      );
    } catch (error) {
      logger.error('Error detecting objects:', error);
      return null;
    }
  }

  /**
   * Detect faces in an image
   */
  private async detectFaces(
    imageBuffer: Buffer,
    imageHash: string
  ): Promise<Array<{ boundingBox: any; confidence: number; landmarks?: any }> | null> {
    const cacheKey = `faces:${imageHash}`;
    
    try {
      return await getWithCache<Array<{ boundingBox: any; confidence: number; landmarks?: any }>>(
        cacheKey,
        async () => {
          // Queue the job for processing
          const job = await addJob(
            QueueType.FACE_RECOGNITION,
            JobType.DETECT_FACES,
            { imageBuffer: imageBuffer.toString('base64') }
          );
          
          // Wait for job to complete
          const result = await job.finished();
          return result.faces;
        },
        86400 // 24 hours cache
      );
    } catch (error) {
      logger.error('Error detecting faces:', error);
      return null;
    }
  }

  /**
   * Extract text from an image (OCR)
   */
  private async extractText(
    imageBuffer: Buffer,
    imageHash: string
  ): Promise<string[] | null> {
    const cacheKey = `text:${imageHash}`;
    
    try {
      return await getWithCache<string[]>(
        cacheKey,
        async () => {
          // Queue the job for processing
          const job = await addJob(
            QueueType.OCR_EXTRACTION,
            JobType.EXTRACT_TEXT,
            { imageBuffer: imageBuffer.toString('base64') }
          );
          
          // Wait for job to complete
          const result = await job.finished();
          return result.text;
        },
        86400 // 24 hours cache
      );
    } catch (error) {
      logger.error('Error extracting text:', error);
      return null;
    }
  }

  /**
   * Classify the scene in an image
   */
  private async classifyScene(
    imageBuffer: Buffer,
    imageHash: string
  ): Promise<{ type: string; confidence: number } | null> {
    const cacheKey = `scene:${imageHash}`;
    
    try {
      return await getWithCache<{ type: string; confidence: number }>(
        cacheKey,
        async () => {
          // Queue the job for processing
          const job = await addJob(
            QueueType.IMAGE_ANALYSIS,
            JobType.CLASSIFY_SCENE,
            { imageBuffer: imageBuffer.toString('base64') }
          );
          
          // Wait for job to complete
          const result = await job.finished();
          return result.scene;
        },
        86400 // 24 hours cache
      );
    } catch (error) {
      logger.error('Error classifying scene:', error);
      return null;
    }
  }

  /**
   * Generate tags based on image analysis results
   */
  private async generateTags(
    caption: string | null,
    objects: string[],
    scene: string,
    extractedText: string[]
  ): Promise<Array<{
    name: string;
    category: 'object' | 'person' | 'emotion' | 'activity' | 'location' | 'event';
    confidence: number;
    synonyms?: string[];
    related_tags?: string[];
  }> | null> {
    try {
      // Create a prompt for the tag generation model
      const prompt = `
      Based on this image analysis:
      - Caption: "${caption || 'No caption available'}"
      - Objects detected: ${objects.join(', ') || 'None detected'}
      - Scene type: ${scene || 'Unknown'}
      - Text in image: ${extractedText.join(', ') || 'None detected'}
      
      Generate 8-12 relevant, searchable tags categorized as:
      - Objects (what's in the image)
      - People (relationships, activities)
      - Emotions (mood, feelings)
      - Activities (what's happening)
      - Locations (where type of place)
      - Events (occasion, celebration)
      
      Return as JSON array with confidence scores.
      `;
      
      // Queue the job for processing
      const job = await addJob(
        QueueType.TAG_GENERATION,
        JobType.GENERATE_TAGS,
        { prompt }
      );
      
      // Wait for job to complete
      const result = await job.finished();
      return result.tags;
    } catch (error) {
      logger.error('Error generating tags:', error);
      return null;
    }
  }

  /**
   * Create a hash of a buffer for caching
   */
  private hashBuffer(buffer: Buffer): string {
    return crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex');
  }
}

export default new AIService();