import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Default rate limit window and max requests
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10); // 100 requests per window

// Create a rate limiter with dynamic limits based on user subscription
export const rateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: (req: Request) => {
    // Get user subscription tier from request (set by auth middleware)
    const userTier = (req as any).user?.subscriptionTier || 'free';
    
    // Adjust limits based on subscription tier
    switch (userTier) {
      case 'premium':
        return MAX_REQUESTS * 5; // 5x the requests for premium users
      case 'pro':
        return MAX_REQUESTS * 2; // 2x the requests for pro users
      default:
        return MAX_REQUESTS; // Default limit for free users
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    error: {
      message: 'Too many requests, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(WINDOW_MS / 1000 / 60) // minutes
      }
    });
  }
});

// Export as apiLimiter for backward compatibility
export const apiLimiter = rateLimiter;

// Specific rate limiter for uploads
export const uploadRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: parseInt(process.env.UPLOAD_RATE_LIMIT || '10', 10), // 10 uploads per window
  message: {
    status: 429,
    success: false,
    error: {
      message: 'Too many uploads, please try again later.',
      code: 'UPLOAD_LIMIT_EXCEEDED'
    }
  }
});