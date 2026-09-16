import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";
import syncLogbooks from "../utils/syncBook.js";

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
      throw new Error(parseError(result.error));
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
    const exerciseId = Number(body.exerciseId);
    const fieldConfig = {
      exerciseId: "number",
      topset_weight: "number",
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
      throw new Error(parseError(result.error));
    }

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

    await this.logbookRepo.create(newData);

    return { message: "Logbook successfully created." };
  }

  async syncLogbook(userId, body) {
    const { exercises } = body;
    const synchronizations = [];

    for (const exerciseId of exercises) {
      try {
        const syncResult = await syncLogbooks(userId, exerciseId, this.prisma);
        synchronizations.push(syncResult);
      } catch (error) {
        throw new Error(error);
      }
    }

    return {
      message: synchronizations,
    };
  }

  async deleteLogbook(userId, id) {
    const logbookId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: logbookId }, fieldConfig);

    if (!result.success) {
      throw new Error(parseError(result.error));
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

    await this.logbookRepo.findByIdAndDelete(logbookId);

    return { message: "Logbook successfully deleted." };
  }
}
