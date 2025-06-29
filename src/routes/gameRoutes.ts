import { Router } from 'express';
import { apiLimiter } from '../middleware/rateLimiter';
import { validateGameSession } from '../middleware/validator';
import {
  startGameSession,
  submitAnswer,
  getGameHistory,
  getAchievements
} from '../controllers/gameController';

const router = Router();

// Apply rate limiters
router.use(apiLimiter);

// Routes
router.post('/start', validateGameSession, startGameSession);
router.post('/:session_id/answer', submitAnswer);
router.get('/history', getGameHistory);
router.get('/achievements', getAchievements);

export default router;