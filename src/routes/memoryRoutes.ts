import { Router } from 'express';
import { upload, validateImageUpload, validateSearch } from '../middleware/validator';
import { apiLimiter, uploadLimiter } from '../middleware/rateLimiter';
import {
  analyzeMemories,
  getMemories,
  getMemoryById,
  deleteMemory,
  searchMemories
} from '../controllers/memoryController';

const router = Router();

// Apply rate limiters
router.use(apiLimiter);

// Routes
router.post(
  '/analyze',
  uploadLimiter,
  upload.array('images', 10),
  validateImageUpload,
  analyzeMemories
);

router.get('/', getMemories);
router.get('/search', validateSearch, searchMemories);
router.get('/:id', getMemoryById);
router.delete('/:id', deleteMemory);

export default router;