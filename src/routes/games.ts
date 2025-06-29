import { Router } from 'express';
import { validate, schemas } from '../middleware/validation';
import { GamesController } from '../controllers/gamesController';

const router = Router();
const gamesController = new GamesController();

// Start a new game session
router.post(
  '/start',
  validate(schemas.gameSession),
  gamesController.startGame
);

// Submit an answer for the current question
router.post(
  '/:sessionId/answer',
  validate(schemas.gameAnswer),
  gamesController.submitAnswer
);

// Get the next question
router.get('/:sessionId/next', gamesController.getNextQuestion);

// End a game session
router.post('/:sessionId/end', gamesController.endGame);

// Get game statistics
router.get('/stats', gamesController.getGameStats);

// Get leaderboard
router.get('/leaderboard', gamesController.getLeaderboard);

// Get user achievements
router.get('/achievements', gamesController.getAchievements);

export default router;