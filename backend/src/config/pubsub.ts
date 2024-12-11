import { RedisPubSub } from "graphql-redis-subscriptions";
import { PubSubPayload } from "../types/pubsub.types";
import Redis from "ioredis";

const options = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});
