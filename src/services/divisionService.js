import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

export default class DivisionService {
  constructor(divisionRepo, workoutRepo) {
    this.divisionRepo = divisionRepo;
    this.workoutRepo = workoutRepo;
  }

  async getDivisions(data) {
    const fieldConfig = { workoutId: "number", page: "number", limit: "limit" };

    const params = {
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

    const { divisions, total } = await this.divisionRepo.findAll({
      userId: data.userId,
      workoutId: result.data.workoutId,
      isDeleted: false,
      page: result.data.page,
      limit: result.data.limit,
    });

    if (!divisions || divisions.length === 0) {
      const error = new Error("No divisions found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      divisions,
      pagination: {
        total,
        page: Number(result.data.page || 1),
        limit: Number(result.data.limit || 10),
        totalPages: Math.ceil(total / (Number(result.data.limit) || 10)),
      },
    };
  }

  async getDivisionById(data) {
    const fieldConfig = { divisionId: "number", workoutId: "number" };

    const params = {
      divisionId: Number(data.divisionId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const division = await this.divisionRepo.findById({
      userId: data.userId,
      divisionId: result.data.divisionId,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (!division) {
      const error = new Error("Division not found.");
      error.statusCode = 404;
      throw error;
    }

    return division;
  }

  async createDivision(data) {
    const DAYS = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const fieldConfig = {
      name: "string",
      day: "string",
      workoutId: "number",
    };

    const result = validateFields(data.body, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const lowercaseDay = result.data.day.toLowerCase();

    if (!DAYS.includes(lowercaseDay)) {
      const error = new Error(`'${result.data.day}' is not a day of the week.`);
      error.statusCode = 400;
      throw error;
    }

    const workout = await this.workoutRepo.findById({
      userId: data.userId,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (!workout) {
      const error = new Error(
        "Workout not found. Please create a workout first.",
      );
      error.statusCode = 404;
      throw error;
    }

    const dayUsed = await this.divisionRepo.findOne({
      userId: data.userId,
      day: lowercaseDay,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (dayUsed) {
      const error = new Error(
        "A division for this day already exists inside this workout.",
      );
      error.statusCode = 409;
      throw error;
    }

    const division = {
      ...result.data,
      userId: data.userId,
    };

    await this.divisionRepo.create(division);

    return { message: "Division successfully created." };
  }

  async deleteDivision(data) {
    const fieldConfig = { divisionId: "number", workoutId: "number" };

    const params = {
      divisionId: Number(data.divisionId),
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

    if (divisionExists.exercises.length > 0) {
      const error = new Error(
        "Division contain exercises, please delete them before hand.",
      );
      error.statusCode = 409;
      throw error;
    }

    await this.divisionRepo.findByIdAndDelete(result.data.divisionId);

    return { message: "Division successfully deleted." };
  }
}
