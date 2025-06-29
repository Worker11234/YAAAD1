import { Router } from 'express';
import { upload, validateImageUpload, validateSearch } from '../middleware/validator';
import { rateLimiter, uploadRateLimiter } from '../middleware/rateLimiter';
import {
  analyzeMemories,
  getMemories,
  getMemoryById,
  deleteMemory,
  searchMemories
} from '../controllers/memoryController';

const router = Router();

// Apply rate limiters
router.use(rateLimiter);

// Routes
router.post(
  '/analyze',
  uploadRateLimiter,
  upload.array('images', 10),
  validateImageUpload,
  analyzeMemories
);

router.get('/', getMemories);
router.get('/search', validateSearch, searchMemories);
router.get('/:id', getMemoryById);
router.delete('/:id', deleteMemory);

export default router;