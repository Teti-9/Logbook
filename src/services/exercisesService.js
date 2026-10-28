import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

export default class ExercisesService {
  constructor(exercisesRepo, divisionRepo, prisma) {
    this.exercisesRepo = exercisesRepo;
    this.divisionRepo = divisionRepo;
    this.prisma = prisma;
  }

  async getExercises(data) {
    const fieldConfig = {
      divisionId: "number",
      workoutId: "number",
      page: "number",
      limit: "limit",
    };

    const params = {
      divisionId: Number(data.divisionId),
      workoutId: Number(data.workoutId),
      page: Number(data.page),
      limit: Number(data.limit),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const { exercises, total } = await this.exercisesRepo.findAll({
      userId: data.userId,
      divisionId: result.data.divisionId,
      workoutId: result.data.workoutId,
      isDeleted: false,
      page: result.data.page,
      limit: result.data.limit,
    });

    if (!exercises || exercises.length === 0) {
      const error = new Error("No exercises found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      exercises,
      pagination: {
        total,
        page: Number(result.data.page || 1),
        limit: Number(result.data.limit || 10),
        totalPages: Math.ceil(total / (Number(result.data.limit) || 10)),
      },
    };
  }

  async getExerciseById(data) {
    const fieldConfig = {
      exerciseId: "number",
      divisionId: "number",
      workoutId: "number",
    };

    const params = {
      exerciseId: Number(data.exerciseId),
      divisionId: Number(data.divisionId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const exercise = await this.exercisesRepo.findById({
      userId: data.userId,
      exerciseId: result.data.exerciseId,
      divisionId: result.data.divisionId,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (!exercise) {
      const error = new Error("Exercise not found.");
      error.statusCode = 404;
      throw error;
    }

    return exercise;
  }

  async createExercise(data) {
    const fieldConfig = {
      name: "string",
      target_muscle_group: "string",
      series_reps: "string",
      rest: "number",
      advanced_technique: "optional",
      observation: "optional",
      workoutId: "number",
      divisionId: "number",
    };

    const params = {
      ...data.body,
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const divisionExists = await this.divisionRepo.findById({
      userId: data.userId,
      divisionId: result.data.divisionId,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (!divisionExists) {
      const error = new Error("Division not found.");
      error.statusCode = 404;
      throw error;
    }

    const name = result.data.name.toLowerCase();

    const exercise = {
      ...result.data,
      name,
      advanced_technique: result.data.advanced_technique || null,
      observation: result.data.observation || null,
      userId: data.userId,
    };

    await this.exercisesRepo.create(exercise);
    await this.prisma.ExerciseCatalog.create({
      data: {
        name,
        target_muscle_group: result.data.target_muscle_group.toLowerCase(),
      },
    });

    return { message: "Exercise successfully created." };
  }

  async deleteExercise(data) {
    const fieldConfig = {
      exerciseId: "number",
      divisionId: "number",
      workoutId: "number",
    };

    const params = {
      exerciseId: Number(data.exerciseId),
      divisionId: Number(data.divisionId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const exercise = await this.exercisesRepo.findById({
      userId: data.userId,
      exerciseId: result.data.exerciseId,
      workoutId: result.data.workoutId,
      divisionId: result.data.divisionId,
      isDeleted: false,
    });

    if (!exercise) {
      const error = new Error("Exercise not found.");
      error.statusCode = 404;
      throw error;
    }

    if (exercise.logbooks.length > 0) {
      const error = new Error(
        "Exercise contains unsynced logbooks, please delete or sync them before hand.",
      );
      error.statusCode = 409;
      throw error;
    }

    await this.exercisesRepo.findByIdAndDelete(result.data.exerciseId);

    return { message: "Exercise successfully deleted." };
  }
}
