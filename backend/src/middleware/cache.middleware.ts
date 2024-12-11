import { redisService } from "../services/redis.service";

export const cacheMiddleware = async (resolve, root, args, context, info) => {
  if (info.operation.operation !== "query") {
    return resolve(root, args, context, info);
  }

  const key = `graphql:${info.parentType.name}:${info.fieldName}:${JSON.stringify(args)}`;

  const cached = await redisService.get(key);
  if (cached) {
    return cached;
  }

  const result = await resolve(root, args, context, info);
  if (result) {
    await redisService.set(key, result, 3600);
  }

  return result;
};
