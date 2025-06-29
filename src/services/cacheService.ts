import { createClient } from 'redis';
import { config } from 'dotenv';
import logger from '../utils/logger';

config();

let redisClient: ReturnType<typeof createClient>;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // Continue without Redis in development
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Running without Redis cache in development mode');
      return null;
    }
    throw error;
  }
};

export class CacheService {
  private static instance: CacheService;
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

  constructor() {
    if (CacheService.instance) {
      return CacheService.instance;
    }
    CacheService.instance = this;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      // Try memory cache first
      const memCached = this.memoryCache.get(key);
      if (memCached && memCached.expiry > Date.now()) {
        return memCached.value as T;
      } else if (memCached) {
        // Expired
        this.memoryCache.delete(key);
      }

      // Try Redis if available
      if (redisClient && redisClient.isOpen) {
        const value = await redisClient.get(key);
        if (value) {
          const parsed = JSON.parse(value) as T;
          // Store in memory cache
          this.memoryCache.set(key, {
            value: parsed,
            expiry: Date.now() + 60000 // 1 minute
          });
          return parsed;
        }
      }

      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      // Store in memory cache
      this.memoryCache.set(key, {
        value,
        expiry: Date.now() + (ttlSeconds * 1000)
      });

      // Store in Redis if available
      if (redisClient && redisClient.isOpen) {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      }

      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      // Remove from memory cache
      this.memoryCache.delete(key);

      // Remove from Redis if available
      if (redisClient && redisClient.isOpen) {
        await redisClient.del(key);
      }

      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {
      // Clear memory cache
      this.memoryCache.clear();

      // Clear Redis if available
      if (redisClient && redisClient.isOpen) {
        await redisClient.flushAll();
      }

      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }
}

export { CacheService }