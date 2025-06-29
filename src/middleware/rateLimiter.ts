import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Standard rate limiter for API endpoints
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes by default
  max: (req: Request) => {
    // Premium users get higher limits
    return req.user?.subscription_tier === 'premium' 
      ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10) * 2 
      : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    error: {
      message: 'Too many requests, please try again later.',
      upgrade_available: true
    }
  },
  keyGenerator: (req: Request) => {
    return req.user?.id || req.ip;
  }
});

// Stricter rate limiter for upload endpoints
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req: Request) => {
    // Premium users get higher upload limits
    return req.user?.subscription_tier === 'premium' 
      ? parseInt(process.env.UPLOAD_RATE_LIMIT || '10', 10) * 3 
      : parseInt(process.env.UPLOAD_RATE_LIMIT || '10', 10);
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    error: {
      message: 'Upload limit reached. Please try again later or upgrade your plan.',
      upgrade_available: true
    }
  },
  keyGenerator: (req: Request) => {
    return req.user?.id || req.ip;
  }
});

// Rate limiter for authentication endpoints to prevent brute force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    error: {
      message: 'Too many login attempts, please try again later.'
    }
  }
});