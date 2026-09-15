import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

export default class DivisionService {
  constructor(divisionRepo) {
    this.divisionRepo = divisionRepo;
  }

  async getDivisions(userId, { page = 1, limit = 10 } = {}) {
    const fieldConfig = { page: "number" };

    const result = validateFields({ page: Number(page) }, fieldConfig);

    if (!result.success) {
      throw new Error("Page cannot be zero or a negative number.");
    }

    const { divisions, total } = await this.divisionRepo.findAll(
      {
        userId: userId,
        isDeleted: false,
      },
      {
        page,
        limit,
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
    const fieldConfig = { name: "string", day: "string" };

    const result = validateFields(body, fieldConfig);

    if (!result.success) {
      throw new Error(parseError(result.error));
    }
    const lowercaseName = body.name.toLowerCase();
    const lowercaseDay = body.day.toLowerCase();
    const DAYS = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

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
      error.statusCode = 400;
      throw error;
    }

    const newData = {
      name: lowercaseName,
      day: lowercaseDay,
      userId: userId,
    };

    await this.divisionRepo.create(newData);

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
