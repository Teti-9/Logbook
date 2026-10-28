import redis from "../config/infra/redis.js";
import { Worker } from "bullmq";
import { syncLogbookJob } from "../jobs/syncJob.js";

const worker = new Worker(
  "Queue",
  async (job) => {
    console.log("Working...");

    switch (job.name) {
      case "taskSync":
        const { userId, exerciseId, workoutId } = job.data;
        return syncLogbookJob.handle(userId, exerciseId, workoutId);
    }
  },
  { connection: redis.redis },
);

console.log("Worker up.");

worker.on("active", (job) => {
  console.log(`Job ${job.id} started`);
});

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`, result);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on("error", (err) => console.error("Worker error:", err));
