import { Redis, RedisOptions } from "ioredis";

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  username: "user",
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    console.log(`Redis retry attempt ${times}`);
    return Math.min(times * 50, 2000);
  },
};

export const redisClient = new Redis(redisOptions);

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Successfully connected to Redis");
});
