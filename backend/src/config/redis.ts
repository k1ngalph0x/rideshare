import { Redis, RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times: number) => {
    return Math.min(times * 50, 2000);
  },
};

export const redisClient = new Redis(redisOptions);
