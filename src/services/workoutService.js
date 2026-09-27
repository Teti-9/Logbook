import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

export default class WorkoutService {
  constructor(workoutRepo) {
    this.workoutRepo = workoutRepo;
  }

  async getWorkouts(userId, { page = 1, limit = 10 } = {}) {
    const fieldConfig = { page: "page", limit: "limit" };

    const params = {
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const { workouts, total } = await this.workoutRepo.findAll(
      {
        userId: userId,
        isDeleted: false,
      },
      {
        page: result.data.page ? result.data.page : 1,
        limit: result.data.limit ? result.data.limit : 10,
      },
    );

    if (!workouts || workouts.length === 0) {
      const error = new Error("No workouts found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      workouts,
      pagination: {
        total,
        page: Number(page || 1),
        limit: Number(limit || 10),
        totalPages: Math.ceil(total / (Number(limit) || 10)),
      },
    };
  }

  async getWorkoutById(userId, id) {
    const workoutId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: workoutId }, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const workoutExists = await this.workoutRepo.findById({
      userId: userId,
      id: workoutId,
      isDeleted: false,
    });

    if (!workoutExists) {
      const error = new Error("Workout not found.");
      error.statusCode = 404;
      throw error;
    }

    return workoutExists;
  }

  async createWorkout(userId, body) {
    const fieldConfig = {
      name: "string",
      observation: "optional",
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

    const name = result.data.name.toLowerCase();

    const data = {
      ...result.data,
      name,
    };

    await this.workoutRepo.create(data);

    return { message: "Training split successfully created." };
  }

  async deleteWorkout(userId, id) {
    const workoutId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: workoutId }, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const workoutExists = await this.workoutRepo.findById({
      userId: userId,
      id: workoutId,
      isDeleted: false,
    });

    if (!workoutExists) {
      const error = new Error("Workout not found.");
      error.statusCode = 404;
      throw error;
    }

    if (workoutExists.divisions.length > 0) {
      const error = new Error(
        "Workout contain divisions, please delete them before hand.",
      );
      error.statusCode = 409;
      throw error;
    }

    await this.workoutRepo.findByIdAndDelete(workoutId);

    return { message: "Workout successfully deleted." };
  }
}
