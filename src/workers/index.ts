import { QueueType, getQueue, initializeQueues } from '../services/queueService';
import { config } from 'dotenv';
import { logger } from '../utils/logger';
import { imageAnalysisProcessor } from './imageAnalysisWorker';
import { faceRecognitionProcessor } from './faceRecognitionWorker';
import { tagGenerationProcessor } from './tagGenerationWorker';
import { ocrExtractionProcessor } from './ocrExtractionWorker';
import { notificationProcessor } from './notificationWorker';

// Load environment variables
config();

// Initialize queues
initializeQueues();

// Register processors
const imageAnalysisQueue = getQueue(QueueType.IMAGE_ANALYSIS);
const faceRecognitionQueue = getQueue(QueueType.FACE_RECOGNITION);
const tagGenerationQueue = getQueue(QueueType.TAG_GENERATION);
const ocrExtractionQueue = getQueue(QueueType.OCR_EXTRACTION);
const notificationQueue = getQueue(QueueType.NOTIFICATION);

// Process jobs
imageAnalysisQueue.process('*', imageAnalysisProcessor);
faceRecognitionQueue.process('*', faceRecognitionProcessor);
tagGenerationQueue.process('*', tagGenerationProcessor);
ocrExtractionQueue.process('*', ocrExtractionProcessor);
notificationQueue.process('*', notificationProcessor);

// Log worker startup
logger.info('Worker processes started');
logger.info(`Processing jobs for queues: ${Object.values(QueueType).join(', ')}`);

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down workers gracefully');
  
  // Close all queue connections
  await Promise.all([
    imageAnalysisQueue.close(),
    faceRecognitionQueue.close(),
    tagGenerationQueue.close(),
    ocrExtractionQueue.close(),
    notificationQueue.close()
  ]);
  
  logger.info('All queue connections closed');
  process.exit(0);
});

// Keep the process running
process.stdin.resume();