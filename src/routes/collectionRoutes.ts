import { Router } from 'express';
import { apiLimiter } from '../middleware/rateLimiter';
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addMemoryToCollection,
  removeMemoryFromCollection,
  generateSmartCollection
} from '../controllers/collectionController';

const router = Router();

// Apply rate limiters
router.use(apiLimiter);

// Routes
router.post('/', createCollection);
router.get('/', getCollections);
router.get('/:id', getCollectionById);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);
router.post('/:id/memories', addMemoryToCollection);
router.delete('/:id/memories/:memory_id', removeMemoryFromCollection);
router.post('/auto-generate', generateSmartCollection);

export default router;