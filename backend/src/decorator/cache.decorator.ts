import { redisService } from "../services/redis.service";

export interface CacheOptions {
  ttl?: number;
  key?: string | ((args: any[]) => string);
}

export function Cache(options: CacheOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key =
        typeof options.key === "function"
          ? options.key(args)
          : options.key ||
            `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      const cachedValue = await redisService.get(key);
      if (cachedValue) {
        console.log(`Cache hit for key: ${key}`);
        return cachedValue;
      }

      const result = await originalMethod.apply(this, args);
      if (result) {
        await redisService.set(key, result, options.ttl || 3600);
      }
      return result;
    };

    return descriptor;
  };
}
