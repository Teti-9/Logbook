import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";
import { addQueue } from "../queue.js";

export default class LogbookService {
  constructor(logbookRepo, exercisesRepo, prisma) {
    this.logbookRepo = logbookRepo;
    this.exercisesRepo = exercisesRepo;
    this.prisma = prisma;
  }

  async getLogbooks(userId) {
    const logbooks = await this.logbookRepo.findAll({
      userId: userId,
      sync: false,
      isDeleted: false,
    });

    if (!logbooks || logbooks.length === 0) {
      const error = new Error("No logbooks found.");
      error.statusCode = 404;
      throw error;
    }

    return logbooks;
  }

  async getLogbookById(userId, id) {
    const logbookId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: logbookId }, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const logbook = await this.logbookRepo.findById({
      userId: userId,
      id: logbookId,
      sync: false,
      isDeleted: false,
    });

    if (!logbook) {
      const error = new Error("Logbook not found.");
      error.statusCode = 404;
      throw error;
    }

    return logbook;
  }

  async createLogbook(userId, body) {
    const fieldConfig = {
      exerciseId: "number",
      topset_weight: "float",
      topset_reps: "number",
      extra: "optional",
      userId: "number",
    };

    const newData = {
      ...body,
      userId: userId,
    };

    const result = validateFields(newData, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const exerciseId = result.data.exerciseId;

    const exerciseExists = await this.exercisesRepo.findById({
      userId: userId,
      id: exerciseId,
      isDeleted: false,
    });

    if (!exerciseExists) {
      const error = new Error("Exercise not found.");
      error.statusCode = 404;
      throw error;
    }

    const logbookExists = await this.logbookRepo.findById({
      userId: userId,
      exerciseId,
      sync: false,
      isDeleted: false,
    });

    if (logbookExists) {
      const error = new Error(
        "A logbook for this exercise already exists and it is not yet synced.",
      );
      error.statusCode = 400;
      throw error;
    }

    await this.logbookRepo.create(result.data);

    return { message: "Logbook successfully created." };
  }

  async syncLogbook(userId, body) {
    const { exercises } = body;
    const fieldConfig = { exercises: "array" };

    const result = validateFields(body, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    for (const exerciseId of exercises) {
      await addQueue.add(
        "taskSync",
        { userId, exerciseId },
        {
          attempts: 2,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: { count: 1000 },
          removeOnFail: { count: 5000 },
        },
      );
    }
    return { message: "Logbook(s) successfully added for synchronization." };
  }

  async logbookJob(userId, id) {
    const jobId = Number(id);
    const fieldConfig = { id: "number" };
    const result = validateFields({ id: jobId }, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const jobResult = await addQueue.getJob(jobId);

    if (!jobResult) {
      const error = new Error("Job not found.");
      error.statusCode = 404;
      throw error;
    }

    if (jobResult.data.userId !== userId) {
      const error = new Error("Job not found.");
      error.statusCode = 404;
      throw error;
    }

    const state = await jobResult.getState();
    const failed = jobResult.failedReason;
    const returnValue = jobResult.returnvalue;

    const data = {
      state,
      failed,
      returnValue,
    };

    return data;
  }

  async deleteLogbook(userId, id) {
    const logbookId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: logbookId }, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const logbook = await this.logbookRepo.findById({
      userId: userId,
      id: logbookId,
      isDeleted: false,
    });

    if (!logbook) {
      const error = new Error("Logbook not found.");
      error.statusCode = 404;
      throw error;
    }

    await this.logbookRepo.findByIdAndDelete(logbookId);

    return { message: "Logbook successfully deleted." };
  }
}
