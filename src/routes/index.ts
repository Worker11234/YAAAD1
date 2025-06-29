import { Router } from 'express';
import memoryRoutes from './memoryRoutes';
import gameRoutes from './gameRoutes';
import peopleRoutes from './peopleRoutes';
import collectionRoutes from './collectionRoutes';
import { authenticate } from '../middleware/auth';

export const setupRoutes = (): Router => {
  const router = Router();

  // API documentation route
  router.get('/docs', (req, res) => {
    res.status(200).json({
      message: 'API Documentation',
      version: process.env.APP_VERSION || '1.0.0',
      endpoints: {
        memories: '/memories',
        games: '/games',
        people: '/people',
        collections: '/collections'
      }
    });
  });

  // Mount routes
  router.use('/memories', authenticate, memoryRoutes);
  router.use('/games', authenticate, gameRoutes);
  router.use('/people', authenticate, peopleRoutes);
  router.use('/collections', authenticate, collectionRoutes);

  return router;
};

export default setupRoutes;