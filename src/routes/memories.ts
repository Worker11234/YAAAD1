import { Router } from 'express';
import multer from 'multer';
import { validate, schemas } from '../middleware/validation';
import { uploadRateLimiter } from '../middleware/rateLimiter';
import { MemoriesController } from '../controllers/memoriesController';

const router = Router();
const memoriesController = new MemoriesController();

// Configure multer for memory storage (not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB default
  }
});

// Get all memories for the authenticated user
router.get('/', memoriesController.getMemories);

// Get a single memory by ID
router.get('/:id', memoriesController.getMemoryById);

// Search memories with advanced filters
router.get('/search', memoriesController.searchMemories);

// Upload and analyze new memories
router.post(
  '/analyze',
  uploadRateLimiter,
  upload.array('images', 10), // Max 10 images per request
  validate(schemas.memoryUpload),
  memoriesController.analyzeMemories
);

// Update memory details
router.put(
  '/:id',
  validate(schemas.memoryUpdate),
  memoriesController.updateMemory
);

// Delete a memory
router.delete('/:id', memoriesController.deleteMemory);

// Get memory statistics
router.get('/stats', memoriesController.getMemoryStats);

// Mobile-optimized endpoint
router.get('/mobile', memoriesController.getMobileMemories);

export default router;