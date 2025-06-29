import { Router } from 'express';
import { 
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  updateProfile
} from '../controllers/authController';
import { validateRegistration, validateLogin } from '../middleware/validators';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Auth endpoints
router.post(
  '/register',
  rateLimiter('auth'),
  validateRegistration,
  register
);

router.post(
  '/login',
  rateLimiter('auth'),
  validateLogin,
  login
);

router.post(
  '/refresh-token',
  refreshToken
);

router.post(
  '/logout',
  authenticate,
  logout
);

// User profile
router.get(
  '/me',
  authenticate,
  getCurrentUser
);

router.put(
  '/profile',
  authenticate,
  updateProfile
);

export default router;