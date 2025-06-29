import Bull, { Queue, Job } from 'bull';
import { logger } from '../utils/logger';

// Queue types
export enum QueueType {
  IMAGE_ANALYSIS = 'image-analysis',
  FACE_RECOGNITION = 'face-recognition',
  TAG_GENERATION = 'tag-generation',
  OCR_EXTRACTION = 'ocr-extraction',
  NOTIFICATION = 'notification'
}

// Job types
export enum JobType {
  // Image Analysis Jobs
  ANALYZE_IMAGE = 'analyze-image',
  GENERATE_CAPTION = 'generate-caption',
  DETECT_OBJECTS = 'detect-objects',
  CLASSIFY_SCENE = 'classify-scene',
  
  // Face Recognition Jobs
  DETECT_FACES = 'detect-faces',
  RECOGNIZE_FACES = 'recognize-faces',
  TRAIN_FACE_MODEL = 'train-face-model',
  
  // Tag Generation Jobs
  GENERATE_TAGS = 'generate-tags',
  VERIFY_TAGS = 'verify-tags',
  
  // OCR Jobs
  EXTRACT_TEXT = 'extract-text',
  
  // Notification Jobs
  SEND_NOTIFICATION = 'send-notification'
}

// Queue configuration
const defaultJobOptions = {
  removeOnComplete: 100, // Keep last 100 completed jobs
  removeOnFail: 50, // Keep last 50 failed jobs
  attempts: 3, // Retry 3 times
  backoff: {
    type: 'exponential',
    delay: 2000 // Initial delay in ms
  }
};

// Queue instances
const queues: Record<QueueType, Queue> = {
  [QueueType.IMAGE_ANALYSIS]: new Bull(QueueType.IMAGE_ANALYSIS, {
    redis: process.env.BULL_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
    defaultJobOptions
  }),
  [QueueType.FACE_RECOGNITION]: new Bull(QueueType.FACE_RECOGNITION, {
    redis: process.env.BULL_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
    defaultJobOptions
  }),
  [QueueType.TAG_GENERATION]: new Bull(QueueType.TAG_GENERATION, {
    redis: process.env.BULL_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
    defaultJobOptions
  }),
  [QueueType.OCR_EXTRACTION]: new Bull(QueueType.OCR_EXTRACTION, {
    redis: process.env.BULL_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
    defaultJobOptions
  }),
  [QueueType.NOTIFICATION]: new Bull(QueueType.NOTIFICATION, {
    redis: process.env.BULL_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
    defaultJobOptions: {
      ...defaultJobOptions,
      attempts: 5 // More attempts for notifications
    }
  })
};

// Add job to queue
export const addJob = async <T>(
  queueType: QueueType,
  jobType: JobType,
  data: T,
  options?: Bull.JobOptions
): Promise<Job<T>> => {
  try {
    const queue = queues[queueType];
    const job = await queue.add(jobType, data, options);
    logger.debug(`Added job ${job.id} to queue ${queueType}`, { jobType, data });
    return job;
  } catch (error) {
    logger.error(`Failed to add job to queue ${queueType}`, { jobType, error });
    throw error;
  }
};

// Get queue instance
export const getQueue = (queueType: QueueType): Queue => {
  return queues[queueType];
};

// Get all queues
export const getAllQueues = (): Record<QueueType, Queue> => {
  return queues;
};

// Initialize all queues
export const initializeQueues = (): void => {
  Object.values(queues).forEach(queue => {
    queue.on('error', (error) => {
      logger.error(`Queue error: ${error.message}`, { error });
    });
    
    queue.on('failed', (job, error) => {
      logger.error(`Job ${job.id} failed: ${error.message}`, {
        jobId: job.id,
        jobName: job.name,
        error
      });
    });
  });
  
  logger.info('Bull queues initialized');
};

// Clean all queues (useful for testing)
export const cleanAllQueues = async (): Promise<void> => {
  await Promise.all(Object.values(queues).map(queue => queue.clean(0, 'completed')));
  await Promise.all(Object.values(queues).map(queue => queue.clean(0, 'failed')));
  await Promise.all(Object.values(queues).map(queue => queue.clean(0, 'delayed')));
  await Promise.all(Object.values(queues).map(queue => queue.clean(0, 'wait')));
  await Promise.all(Object.values(queues).map(queue => queue.clean(0, 'active')));
  
  logger.info('All queues cleaned');
};