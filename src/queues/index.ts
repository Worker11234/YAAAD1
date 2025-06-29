import Bull from 'bull';
import { config } from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
config();

// Redis connection options
const redisUrl = process.env.BULL_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379';

// Default job options
const defaultJobOptions = {
  removeOnComplete: 100, // Keep last 100 completed jobs
  removeOnFail: 50, // Keep last 50 failed jobs
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
};

// Create queues
export const imageAnalysisQueue = new Bull('image-analysis', redisUrl, {
  defaultJobOptions
});

export const faceRecognitionQueue = new Bull('face-recognition', redisUrl, {
  defaultJobOptions
});

export const tagGenerationQueue = new Bull('tag-generation', redisUrl, {
  defaultJobOptions
});

// Set up error handlers
[imageAnalysisQueue, faceRecognitionQueue, tagGenerationQueue].forEach(queue => {
  queue.on('error', (error) => {
    logger.error(`Queue ${queue.name} error:`, error);
  });

  queue.on('failed', (job, error) => {
    logger.error(`Job ${job.id} in ${queue.name} failed:`, error);
  });

  queue.on('stalled', (job) => {
    logger.warn(`Job ${job.id} in ${queue.name} stalled`);
  });
});

// Log queue status on startup
const logQueueStatus = async () => {
  try {
    const queues = [imageAnalysisQueue, faceRecognitionQueue, tagGenerationQueue];
    
    for (const queue of queues) {
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount()
      ]);
      
      logger.info(`Queue ${queue.name} status: waiting=${waiting}, active=${active}, completed=${completed}, failed=${failed}`);
    }
  } catch (error) {
    logger.error('Error logging queue status:', error);
  }
};

logQueueStatus();

// Export all queues
export const queues = {
  imageAnalysisQueue,
  faceRecognitionQueue,
  tagGenerationQueue
};