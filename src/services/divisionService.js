import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

export default class DivisionService {
  constructor(divisionRepo, workoutRepo) {
    this.divisionRepo = divisionRepo;
    this.workoutRepo = workoutRepo;
  }

  async getDivisions(userId, { page = 1, limit = 10 } = {}) {
    const fieldConfig = { page: "number", limit: "limit" };

    const params = {
      page: Number(page),
      limit: Number(limit),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const { divisions, total } = await this.divisionRepo.findAll(
      {
        userId: userId,
        isDeleted: false,
      },
      {
        page: result.data.page,
        limit: result.data.limit,
      },
    );

    if (!divisions || divisions.length === 0) {
      const error = new Error("No divisions found.");
      error.statusCode = 404;
      throw error;
    }

    return {
      divisions,
      pagination: {
        total,
        page: Number(page || 1),
        limit: Number(limit || 10),
        totalPages: Math.ceil(total / (Number(limit) || 10)),
      },
    };
  }

  async getDivisionById(userId, id) {
    const divisionId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: divisionId }, fieldConfig);

    if (!result.success) {
      throw new Error(parseError(result.error));
    }

    const division = await this.divisionRepo.findById({
      userId: userId,
      id: divisionId,
      isDeleted: false,
    });

    if (!division) {
      const error = new Error("Division not found.");
      error.statusCode = 404;
      throw error;
    }

    return division;
  }

  async createDivision(userId, body) {
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
      userId: "number",
    };

    const newData = {
      ...body,
      workoutId: body.workoutId,
      userId: userId,
    };

    const result = validateFields(newData, fieldConfig);

    if (!result.success) {
      throw new Error(parseError(result.error));
    }

    const workoutId = result.data.workoutId;

    const workout = await this.workoutRepo.findOne({
      userId: userId,
      id: workoutId,
      isDeleted: false,
    });

    if (!workout) {
      const error = new Error(
        "Workout not found. Please create a workout first.",
      );
      error.statusCode = 404;
      throw error;
    }

    const lowercaseDay = result.data.day.toLowerCase();

    if (!DAYS.includes(lowercaseDay)) {
      const error = new Error(`'${body.day}' is not a day of the week.`);
      error.statusCode = 400;
      throw error;
    }

    const dayUsed = await this.divisionRepo.findOne({
      userId: userId,
      day: lowercaseDay,
      isDeleted: false,
    });

    if (dayUsed) {
      const error = new Error("A division for this day already exists.");
      error.statusCode = 409;
      throw error;
    }

    await this.divisionRepo.create(result.data);

    return { message: "Division successfully created." };
  }

  async deleteDivision(userId, id) {
    const divisionId = Number(id);
    const fieldConfig = { id: "number" };

    const result = validateFields({ id: divisionId }, fieldConfig);

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

    if (divisionExists.exercises.length > 0) {
      const error = new Error(
        "Division contain exercises, please delete them before hand.",
      );
      error.statusCode = 409;
      throw error;
    }

    await this.divisionRepo.findByIdAndDelete(divisionId);

    return { message: "Division successfully deleted." };
  }
}
