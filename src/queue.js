import { Queue } from "bullmq";
import redis from "./config/infra/redis.js";

export const addQueue = new Queue("Queue", {
  connection: redis.redis,
});
