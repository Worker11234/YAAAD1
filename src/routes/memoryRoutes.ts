import { Router } from 'express';
import { upload, validateImageUpload, validateSearch } from '../middleware/validator';
import { rateLimiter, uploadRateLimiter } from '../middleware/rateLimiter';
import { MemoriesController } from '../controllers/memoryController';

const router = Router();
const memoriesController = new MemoriesController();

// Apply rate limiters
router.use(rateLimiter);

// Routes
router.post(
  '/analyze',
  uploadRateLimiter,
  upload.array('images', 10),
  validateImageUpload,
  memoriesController.analyzeMemories.bind(memoriesController)
);

router.get('/', memoriesController.getMemories.bind(memoriesController));
router.get('/search', validateSearch, memoriesController.searchMemories.bind(memoriesController));
router.get('/:id', memoriesController.getMemoryById.bind(memoriesController));
router.delete('/:id', memoriesController.deleteMemory.bind(memoriesController));

export default router;