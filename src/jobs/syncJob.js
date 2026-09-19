import syncLogbooks from "../utils/syncBook.js";

export const syncLogbookJob = {
  async handle(userId, exerciseId) {
    return await syncLogbooks(userId, exerciseId);
  },
};
