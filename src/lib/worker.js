import redis from "../config/infra/redis.js";
import { Worker } from "bullmq";
import { syncLogbookJob } from "../jobs/syncJob.js";

const worker = new Worker(
  "Queue",
  async (job) => {
    console.log("Working...");

    switch (job.name) {
      case "taskSync":
        const { userId, exerciseId } = job.data;
        return syncLogbookJob.handle(userId, exerciseId);
    }
  },
  { connection: redis.redis },
);

console.log("Worker up.");
