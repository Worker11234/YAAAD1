import axios from 'axios';
import { config } from 'dotenv';
import logger from '../utils/logger';
import { ApiError } from '../utils/apiError';
import { CacheService } from './cacheService';

config();

const cacheService = new CacheService();

export interface AnalysisResult {
  caption: string;
  tags: SmartTag[];
  faces: FaceDetection[];
  extractedText: string[];
  scene: string;
  emotions: string[];
  processingTimeMs: number;
}

export interface SmartTag {
  name: string;
  category: 'object' | 'person' | 'emotion' | 'activity' | 'location' | 'event';
  confidence: number;
  synonyms?: string[];
  relatedTags?: string[];
}

export interface FaceDetection {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  personId?: string;
}

export class AIAnalysisService {
  private models = {
    captioning: 'Salesforce/blip-image-captioning-large',
    objectDetection: 'facebook/detr-resnet-50',
    faceDetection: 'opencv/opencv-face-detection',
    textExtraction: 'microsoft/trocr-base-printed',
    sceneClassification: 'google/vit-base-patch16-224',
    emotionDetection: 'j-hartmann/emotion-english-distilroberta-base',
    tagGeneration: 'mistralai/Mistral-7B-Instruct-v0.1'
  };

  private huggingfaceApiKey: string;
  private openaiApiKey: string;

  constructor() {
    this.huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    
    if (!this.huggingfaceApiKey && !this.openaiApiKey) {
      logger.warn('No AI API keys provided. AI analysis will be limited.');
    }
  }

  async analyzeImage(imageBuffer: Buffer): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Run analysis tasks in parallel
      const [caption, objects, faces, extractedText, scene, emotions] = await Promise.allSettled([
        this.generateCaption(imageBuffer),
        this.detectObjects(imageBuffer),
        this.detectFaces(imageBuffer),
        this.extractText(imageBuffer),
        this.classifyScene(imageBuffer),
        this.detectEmotions(imageBuffer)
      ]);
      
      // Generate tags based on the analysis results
      const tags = await this.generateSmartTags(
        caption.status === 'fulfilled' ? caption.value : '',
        objects.status === 'fulfilled' ? objects.value : [],
        scene.status === 'fulfilled' ? scene.value : '',
        emotions.status === 'fulfilled' ? emotions.value : []
      );
      
      const processingTimeMs = Date.now() - startTime;
      
      return {
        caption: caption.status === 'fulfilled' ? caption.value : 'No caption available',
        tags,
        faces: faces.status === 'fulfilled' ? faces.value : [],
        extractedText: extractedText.status === 'fulfilled' ? extractedText.value : [],
        scene: scene.status === 'fulfilled' ? scene.value : 'unknown',
        emotions: emotions.status === 'fulfilled' ? emotions.value : [],
        processingTimeMs
      };
    } catch (error) {
      logger.error('Error analyzing image:', error);
      throw new ApiError(500, 'Failed to analyze image');
    }
  }

  private async generateCaption(imageBuffer: Buffer): Promise<string> {
    try {
      // Try to use cache first
      const cacheKey = `caption:${this.hashBuffer(imageBuffer)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) return cached;
      
      // Use Hugging Face API
      const response = await axios.post(
        `${process.env.HUGGINGFACE_API_URL}/${this.models.captioning}`,
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        }
      );
      
      const caption = response.data[0]?.generated_text || 'No caption available';
      
      // Cache the result
      await cacheService.set(cacheKey, caption, 86400); // 24 hours
      
      return caption;
    } catch (error) {
      logger.error('Error generating caption:', error);
      
      // Fallback to OpenAI if available
      if (this.openaiApiKey) {
        return this.generateCaptionWithOpenAI(imageBuffer);
      }
      
      return 'No caption available';
    }
  }

  private async generateCaptionWithOpenAI(imageBuffer: Buffer): Promise<string> {
    try {
      // Convert buffer to base64
      const base64Image = imageBuffer.toString('base64');
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Generate a detailed caption for this image. Describe what you see in 1-2 sentences.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 100
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0]?.message?.content || 'No caption available';
    } catch (error) {
      logger.error('Error generating caption with OpenAI:', error);
      return 'No caption available';
    }
  }

  private async detectObjects(imageBuffer: Buffer): Promise<string[]> {
    try {
      // Try to use cache first
      const cacheKey = `objects:${this.hashBuffer(imageBuffer)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) return cached;
      
      // Use Hugging Face API
      const response = await axios.post(
        `${process.env.HUGGINGFACE_API_URL}/${this.models.objectDetection}`,
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        }
      );
      
      // Extract object names from response
      const objects = response.data
        .filter((obj: any) => obj.score > 0.5) // Filter by confidence
        .map((obj: any) => obj.label);
      
      // Remove duplicates
      const uniqueObjects = [...new Set(objects)];
      
      // Cache the result
      await cacheService.set(cacheKey, uniqueObjects, 86400); // 24 hours
      
      return uniqueObjects;
    } catch (error) {
      logger.error('Error detecting objects:', error);
      return [];
    }
  }

  private async detectFaces(imageBuffer: Buffer): Promise<FaceDetection[]> {
    try {
      // Skip if face recognition is disabled
      if (process.env.ENABLE_FACE_RECOGNITION !== 'true') {
        return [];
      }
      
      // Try to use cache first
      const cacheKey = `faces:${this.hashBuffer(imageBuffer)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) return cached;
      
      // Use Hugging Face API
      const response = await axios.post(
        `${process.env.HUGGINGFACE_API_URL}/${this.models.faceDetection}`,
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        }
      );
      
      // Transform response to our format
      const faces: FaceDetection[] = response.data.map((face: any) => ({
        boundingBox: {
          x: face.box.xmin,
          y: face.box.ymin,
          width: face.box.xmax - face.box.xmin,
          height: face.box.ymax - face.box.ymin
        },
        confidence: face.confidence
      }));
      
      // Cache the result
      await cacheService.set(cacheKey, faces, 86400); // 24 hours
      
      return faces;
    } catch (error) {
      logger.error('Error detecting faces:', error);
      return [];
    }
  }

  private async extractText(imageBuffer: Buffer): Promise<string[]> {
    try {
      // Skip if OCR is disabled
      if (process.env.ENABLE_OCR !== 'true') {
        return [];
      }
      
      // Try to use cache first
      const cacheKey = `text:${this.hashBuffer(imageBuffer)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) return cached;
      
      // Use Hugging Face API
      const response = await axios.post(
        `${process.env.HUGGINGFACE_API_URL}/${this.models.textExtraction}`,
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        }
      );
      
      // Extract text from response
      const text = response.data[0]?.generated_text || '';
      
      // Split into lines and filter empty lines
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      // Cache the result
      await cacheService.set(cacheKey, lines, 86400); // 24 hours
      
      return lines;
    } catch (error) {
      logger.error('Error extracting text:', error);
      return [];
    }
  }

  private async classifyScene(imageBuffer: Buffer): Promise<string> {
    try {
      // Try to use cache first
      const cacheKey = `scene:${this.hashBuffer(imageBuffer)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) return cached;
      
      // Use Hugging Face API
      const response = await axios.post(
        `${process.env.HUGGINGFACE_API_URL}/${this.models.sceneClassification}`,
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        }
      );
      
      // Get top scene classification
      const scene = response.data[0]?.label || 'unknown';
      
      // Cache the result
      await cacheService.set(cacheKey, scene, 86400); // 24 hours
      
      return scene;
    } catch (error) {
      logger.error('Error classifying scene:', error);
      return 'unknown';
    }
  }

  private async detectEmotions(imageBuffer: Buffer): Promise<string[]> {
    try {
      // Try to use cache first
      const cacheKey = `emotions:${this.hashBuffer(imageBuffer)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) return cached;
      
      // Use Hugging Face API
      const response = await axios.post(
        `${process.env.HUGGINGFACE_API_URL}/${this.models.emotionDetection}`,
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        }
      );
      
      // Get emotions with confidence > 0.3
      const emotions = response.data
        .filter((emotion: any) => emotion.score > 0.3)
        .map((emotion: any) => emotion.label);
      
      // Cache the result
      await cacheService.set(cacheKey, emotions, 86400); // 24 hours
      
      return emotions;
    } catch (error) {
      logger.error('Error detecting emotions:', error);
      return [];
    }
  }

  private async generateSmartTags(
    caption: string,
    objects: string[],
    scene: string,
    emotions: string[]
  ): Promise<SmartTag[]> {
    try {
      // Create a cache key based on inputs
      const cacheKey = `tags:${this.hashString(caption + objects.join(',') + scene + emotions.join(','))}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) return cached;
      
      // Prepare prompt for tag generation
      const prompt = `
      Based on this image analysis:
      - Caption: "${caption}"
      - Objects detected: ${objects.join(', ')}
      - Scene type: ${scene}
      - Emotions: ${emotions.join(', ')}
      
      Generate 8-12 relevant, searchable tags categorized as:
      - Objects (what's in the image)
      - People (relationships, activities)
      - Emotions (mood, feelings)
      - Activities (what's happening)
      - Locations (where type of place)
      - Events (occasion, celebration)
      
      Return as JSON array with confidence scores.
      `;
      
      // Use Hugging Face API for tag generation
      const response = await axios.post(
        `${process.env.HUGGINGFACE_API_URL}/${this.models.tagGeneration}`,
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      // Parse response
      let tags: SmartTag[] = [];
      try {
        const responseText = response.data[0]?.generated_text || '';
        // Extract JSON from response (it might be wrapped in markdown code blocks)
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                          responseText.match(/```\n([\s\S]*?)\n```/) ||
                          [null, responseText];
        
        if (jsonMatch && jsonMatch[1]) {
          tags = JSON.parse(jsonMatch[1]);
        } else {
          // Fallback to simple tag extraction
          tags = this.extractTagsFromText(caption, objects, scene, emotions);
        }
      } catch (parseError) {
        logger.error('Error parsing tag generation response:', parseError);
        tags = this.extractTagsFromText(caption, objects, scene, emotions);
      }
      
      // Cache the result
      await cacheService.set(cacheKey, tags, 86400); // 24 hours
      
      return tags;
    } catch (error) {
      logger.error('Error generating smart tags:', error);
      return this.extractTagsFromText(caption, objects, scene, emotions);
    }
  }

  private extractTagsFromText(
    caption: string,
    objects: string[],
    scene: string,
    emotions: string[]
  ): SmartTag[] {
    const tags: SmartTag[] = [];
    
    // Add objects as tags
    objects.forEach(object => {
      tags.push({
        name: object.toLowerCase(),
        category: 'object',
        confidence: 0.8
      });
    });
    
    // Add scene as location tag
    if (scene && scene !== 'unknown') {
      tags.push({
        name: scene.toLowerCase(),
        category: 'location',
        confidence: 0.7
      });
    }
    
    // Add emotions as tags
    emotions.forEach(emotion => {
      tags.push({
        name: emotion.toLowerCase(),
        category: 'emotion',
        confidence: 0.6
      });
    });
    
    // Extract potential tags from caption
    const words = caption.toLowerCase().split(/\s+/);
    const potentialTags = words.filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'from', 'have', 'there'].includes(word)
    );
    
    potentialTags.forEach(tag => {
      // Avoid duplicates
      if (!tags.some(t => t.name === tag)) {
        tags.push({
          name: tag,
          category: 'activity', // Default category
          confidence: 0.5
        });
      }
    });
    
    return tags;
  }

  private hashBuffer(buffer: Buffer): string {
    return buffer.toString('base64').substring(0, 20);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
}