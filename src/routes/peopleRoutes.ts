import { Router } from 'express';
import { apiLimiter } from '../middleware/rateLimiter';
import {
  createPerson,
  getPeople,
  getPersonById,
  updatePerson,
  deletePerson,
  getPersonMemories,
  verifyFace
} from '../controllers/peopleController';

const router = Router();

// Apply rate limiters
router.use(apiLimiter);

// Routes
router.post('/', createPerson);
router.get('/', getPeople);
router.get('/:id', getPersonById);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);
router.get('/:id/memories', getPersonMemories);
router.post('/memories/:memory_id/faces/verify', verifyFace);

export default router;