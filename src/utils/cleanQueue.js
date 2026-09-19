import { Queue } from "bullmq";
import redis from "../config/infra/redis.js";

async function clearQueue() {
  const queue = new Queue("Queue", { connection: redis.redis });

  try {
    console.log("Cleaning queue...");

    const counts = await queue.getJobCounts();
    console.log("Jobs:", counts);

    await queue.obliterate({ force: true });

    const countsAfter = await queue.getJobCounts();
    console.log("Jobs:", countsAfter);

    console.log("Cleaned queue.");
    process.exit(0);
  } catch (error) {
    console.error("Eror:", error);
    process.exit(1);
  }
}

clearQueue();
