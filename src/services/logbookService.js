import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";
import { addQueue } from "../queue.js";

export default class LogbookService {
  constructor(logbookRepo, exercisesRepo, prisma) {
    this.logbookRepo = logbookRepo;
    this.exercisesRepo = exercisesRepo;
    this.prisma = prisma;
  }

  async getLogbooks(data) {
    const fieldConfig = { workoutId: "number" };

    const params = {
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const logbooks = await this.logbookRepo.findAll({
      userId: data.userId,
      workoutId: result.data.workoutId,
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

  async getLogbookById(data) {
    const fieldConfig = { logbookId: "number", workoutId: "number" };

    const params = {
      logbookId: Number(data.logbookId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const logbook = await this.logbookRepo.findById({
      userId: data.userId,
      id: result.data.logbookId,
      sync: false,
      isDeleted: false,
      workoutId: result.data.workoutId,
    });

    if (!logbook) {
      const error = new Error("Logbook not found.");
      error.statusCode = 404;
      throw error;
    }

    return logbook;
  }

  async createLogbook(data) {
    const fieldConfig = {
      exerciseId: "number",
      topset_weight: "float",
      topset_reps: "number",
      extra: "optional",
      divisionId: "number",
      workoutId: "number",
    };

    const params = {
      ...data.body,
      divisionId: Number(data.body.divisionId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const exerciseExists = await this.exercisesRepo.findById({
      userId: data.userId,
      exerciseId: result.data.exerciseId,
      divisionId: result.data.divisionId,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (!exerciseExists) {
      const error = new Error("Exercise not found.");
      error.statusCode = 404;
      throw error;
    }

    const logbookExists = await this.logbookRepo.findById({
      userId: data.userId,
      id: result.data.exerciseId,
      workoutId: result.data.workoutId,
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

    const logbook = {
      ...result.data,
      userId: data.userId,
    };

    await this.logbookRepo.create(logbook);

    return { message: "Logbook successfully created." };
  }

  async syncLogbook(data) {
    const fieldConfig = { exercises: "array", workoutId: "number" };

    const { exercises } = data.body;

    const params = {
      exercises,
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const userId = data.userId;
    const workoutId = result.data.workoutId;

    for (const exerciseId of exercises) {
      await addQueue.add(
        "taskSync",
        { userId, exerciseId, workoutId },
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

  async logbookJob(data) {
    const fieldConfig = { jobId: "number" };

    const params = {
      jobId: Number(data.jobId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const jobResult = await addQueue.getJob(result.data.jobId);

    if (!jobResult) {
      const error = new Error("Job not found.");
      error.statusCode = 404;
      throw error;
    }

    if (jobResult.data.userId !== data.userId) {
      const error = new Error("Job not found.");
      error.statusCode = 404;
      throw error;
    }

    const state = await jobResult.getState();
    const failed = jobResult.failedReason;
    const returnValue = jobResult.returnvalue;

    const newData = {
      state,
      failed,
      returnValue,
    };

    return newData;
  }

  async deleteLogbook(data) {
    const fieldConfig = { logbookId: "number", workoutId: "number" };

    const params = {
      logbookId: Number(data.logbookId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const logbook = await this.logbookRepo.findById({
      userId: data.userId,
      id: result.data.logbookId,
      workoutId: result.data.workoutId,
      sync: false,
      isDeleted: false,
    });

    if (!logbook) {
      const error = new Error("Logbook not found.");
      error.statusCode = 404;
      throw error;
    }

    await this.logbookRepo.findByIdAndDelete(result.data.logbookId);

    return { message: "Logbook successfully deleted." };
  }
}
