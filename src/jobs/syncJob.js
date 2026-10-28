import syncLogbooks from "../utils/syncBook.js";

export const syncLogbookJob = {
  async handle(userId, exerciseId, workoutId) {
    return await syncLogbooks(userId, exerciseId, workoutId);
  },
};
