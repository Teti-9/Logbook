import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

export default class ExercisesService {
  constructor(exercisesRepo, divisionRepo, prisma) {
    this.exercisesRepo = exercisesRepo;
    this.divisionRepo = divisionRepo;
    this.prisma = prisma;
  }

  async getExercises(userId, { page = 1, limit = 10 } = {}) {
    const fieldConfig = { page: "number" };

    const result = validateFields({ page: Number(page) }, fieldConfig);

    if (!result.success) {
      throw new Error("Page cannot be zero or a negative number.");
      error.statusCode = 400;
      throw error;
    }

    const { exercises, total } = await this.exercisesRepo.findAll(
      {
        userId: userId,
        isDeleted: false,
      },
      {
        page,
        limit,
      },
    );

    if (!exercises || exercises.length === 0) {
      const error = new Error("No exercises found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      exercises,
      pagination: {
        total,
        page: Number(page || 1),
        limit: Number(limit || 10),
        totalPages: Math.ceil(total / (Number(limit) || 10)),
      },
    };
  }

  async getExerciseById(userId, id) {
    const exerciseId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: exerciseId }, fieldConfig);

    if (!result.success) {
      throw new Error(parseError(result.error));
    }

    const exercise = await this.exercisesRepo.findById({
      userId: userId,
      id: exerciseId,
      isDeleted: false,
    });

    if (!exercise) {
      const error = new Error("Exercise not found.");
      error.statusCode = 404;
      throw error;
    }

    return exercise;
  }

  async createExercise(userId, body) {
    const lowercaseName = body.name.toLowerCase();
    const divisionId = Number(body.divisionId);
    const fieldConfig = {
      name: "string",
      target_muscle_group: "string",
      series_reps: "string",
      rest: "number",
      advanced_technique: "optional",
      observation: "optional",
      divisionId: "number",
      userId: "number",
    };

    const newData = {
      ...body,
      name: lowercaseName,
      divisionId: divisionId,
      userId: userId,
    };

    const result = validateFields(newData, fieldConfig);

    if (!result.success) {
      throw new Error(parseError(result.error));
    }

    const divisionExists = await this.divisionRepo.findById({
      userId: userId,
      id: divisionId,
      isDeleted: false,
    });

    if (!divisionExists) {
      const error = new Error("Division not found.");
      error.statusCode = 404;
      throw error;
    }

    await this.exercisesRepo.create(newData);
    await this.prisma.exercises__.create({
      data: {
        name: lowercaseName,
        target_muscle_group: body.target_muscle_group,
      },
    });

    return { message: "Exercise successfully created." };
  }

  async deleteExercise(userId, id) {
    const exerciseId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: exerciseId }, fieldConfig);

    if (!result.success) {
      throw new Error(parseError(result.error));
    }

    const exercise = await this.exercisesRepo.findById({
      userId: userId,
      id: exerciseId,
      isDeleted: false,
    });

    if (!exercise) {
      const error = new Error("Exercise not found.");
      error.statusCode = 404;
      throw error;
    }

    if (exercise.logbook.length > 0) {
      const error = new Error(
        "Exercise contains unsynced logbooks, please delete or sync them before hand.",
      );
      error.statusCode = 409;
      throw error;
    }

    await this.exercisesRepo.findByIdAndDelete(exerciseId);

    return { message: "Exercise successfully deleted." };
  }
}
