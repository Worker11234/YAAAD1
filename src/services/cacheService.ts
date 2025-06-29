import { createClient } from 'redis';
import { logger } from '../utils/logger';
import NodeCache from 'node-cache';

// In-memory cache for faster access
const memoryCache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 60 // Check for expired keys every 60 seconds
});

// Redis client
let redisClient: ReturnType<typeof createClient>;

// Initialize Redis connection
export const initializeRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({ url: redisUrl });
    
    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });
    
    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });
    
    await redisClient.connect();
    return true;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    return false;
  }
};

// Multi-layer caching strategy
export const getWithCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> => {
  try {
    // Try memory cache first (L1)
    const memCached = memoryCache.get<T>(key);
    if (memCached) {
      logger.debug(`Memory cache hit for key: ${key}`);
      return memCached;
    }
    
    // Try Redis cache (L2)
    if (redisClient && redisClient.isOpen) {
      const redisCached = await redisClient.get(key);
      if (redisCached) {
        logger.debug(`Redis cache hit for key: ${key}`);
        const parsed = JSON.parse(redisCached) as T;
        // Store in memory cache for faster subsequent access
        memoryCache.set(key, parsed);
        return parsed;
      }
    }
    
    // Cache miss, fetch data
    logger.debug(`Cache miss for key: ${key}, fetching data`);
    const data = await fetchFn();
    
    // Store in both caches
    memoryCache.set(key, data);
    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(key, ttl, JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    logger.error(`Cache error for key: ${key}`, error);
    // Fallback to direct fetch on cache error
    return fetchFn();
  }
};

// Set cache
export const setCache = async <T>(
  key: string,
  data: T,
  ttl: number = 3600
): Promise<void> => {
  try {
    // Set in memory cache
    memoryCache.set(key, data);
    
    // Set in Redis if available
    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(key, ttl, JSON.stringify(data));
    }
  } catch (error) {
    logger.error(`Failed to set cache for key: ${key}`, error);
  }
};

// Delete from cache
export const deleteCache = async (key: string): Promise<void> => {
  try {
    // Delete from memory cache
    memoryCache.del(key);
    
    // Delete from Redis if available
    if (redisClient && redisClient.isOpen) {
      await redisClient.del(key);
    }
  } catch (error) {
    logger.error(`Failed to delete cache for key: ${key}`, error);
  }
};

// Clear cache by pattern
export const clearCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    // Clear matching keys from memory cache
    const memKeys = memoryCache.keys();
    const matchingMemKeys = memKeys.filter(k => k.includes(pattern));
    memoryCache.del(matchingMemKeys);
    
    // Clear matching keys from Redis if available
    if (redisClient && redisClient.isOpen) {
      const keys = await redisClient.keys(`*${pattern}*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }
  } catch (error) {
    logger.error(`Failed to clear cache by pattern: ${pattern}`, error);
  }
};

// Get Redis client (for direct access if needed)
export const getRedisClient = () => redisClient;