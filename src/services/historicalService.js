import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

export default class HistoricalService {
  constructor(historicalRepo) {
    this.historicalRepo = historicalRepo;
  }

  async getHistorical(data) {
    const fieldConfig = {
      search: "optional",
      workoutId: "number",
    };

    const params = {
      search: data.search,
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const historical = await this.historicalRepo.findAll({
      userId: data.userId,
      search: result.data.search,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (!historical || historical.length === 0) {
      const error = new Error("No historical archives found.");
      error.statusCode = 404;
      throw error;
    }

    return historical;
  }

  async getHistoricalById(data) {
    const fieldConfig = { historicalId: "number", workoutId: "number" };

    const params = {
      historicalId: Number(data.historicalId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const historical = await this.historicalRepo.findById({
      userId: data.userId,
      historicalId: result.data.historicalId,
      workoutId: result.data.workoutId,
      isDeleted: false,
    });

    if (!historical) {
      const error = new Error("Historical archive not found.");
      error.statusCode = 404;
      throw error;
    }

    return historical;
  }

  async deleteHistorical(data) {
    const fieldConfig = { historicalId: "number", workoutId: "number" };

    const params = {
      historicalId: Number(data.historicalId),
      workoutId: Number(data.workoutId),
    };

    const result = validateFields(params, fieldConfig);

    if (!result.success) {
      const error = new Error(parseError(result.error));
      error.statusCode = 400;
      throw error;
    }

    const historical = await this.historicalRepo.findById({
      userId: data.userId,
      historicalId: Number(result.data.historicalId),
      workoutId: Number(result.data.workoutId),
      isDeleted: false,
    });

    if (!historical) {
      const error = new Error("Historical archive not found.");
      error.statusCode = 404;
      throw error;
    }

    await this.historicalRepo.findByIdAndDelete(result.data.historicalId);

    return { message: "Historical archive successfully deleted." };
  }
}
