import { createClient, RedisClientType } from 'redis';

// Redis client configuration
const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: (retries: number) => Math.min(retries * 50, 1000),
  },
});

// Error handling
redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// Connect to Redis
redisClient.connect().catch((err: Error) => {
  console.error('Redis Connection Error:', err);
});

// Export Redis client instance
export const redis = redisClient;

// Helper functions for common Redis operations
export const redisUtils = {
  async get(key: string): Promise<string | null> {
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error('Redis GET Error:', error);
      return null;
    }
  },

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    try {
      if (expireSeconds) {
        await redisClient.set(key, value, { EX: expireSeconds });
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET Error:', error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis DEL Error:', error);
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      return (await redisClient.exists(key)) === 1;
    } catch (error) {
      console.error('Redis EXISTS Error:', error);
      return false;
    }
  }
}; 