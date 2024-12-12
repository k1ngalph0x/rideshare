import Redis from "ioredis";

class RedisService {
  private client: Redis | null = null;

  async connect() {
    try {
      this.client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        username: "default",
        password: process.env.REDIS_PASSWORD,
        // tls: {
        //   rejectUnauthorized: false,

        //   legacyOnly: true,
        //   minVersion: "TLSv1",
        // },
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.client.on("error", (error) => {
        console.error("Redis Error:", error);
      });

      this.client.on("connect", () => {
        console.log("Connected to Redis");
      });

      // Test connection
      await this.client.ping();
    } catch (error) {
      console.error("Redis Connection Error:", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.quit();
        this.client = null;
        console.log("Disconnected from Redis");
      }
    } catch (error) {
      console.error("Redis Disconnection Error:", error);
      throw error;
    }
  }

  async get(key: string) {
    try {
      if (!this.client) throw new Error("Redis not connected");
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis Get Error:", error);
      return null;
    }
  }

  async set(key: string, value: any, expireSeconds?: number) {
    try {
      if (!this.client) throw new Error("Redis not connected");
      const stringValue = JSON.stringify(value);
      if (expireSeconds) {
        await this.client.setex(key, expireSeconds, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error("Redis Set Error:", error);
      return false;
    }
  }

  async del(key: string) {
    try {
      if (!this.client) throw new Error("Redis not connected");
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error("Redis Delete Error:", error);
      return false;
    }
  }

  async delByPattern(pattern: string) {
    try {
      if (!this.client) throw new Error("Redis not connected");
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      console.error("Redis Pattern Delete Error:", error);
      return false;
    }
  }

  // Helper method to check if Redis is connected
  isConnected(): boolean {
    return this.client !== null && this.client.status === "ready";
  }
}

export const redisService = new RedisService();
