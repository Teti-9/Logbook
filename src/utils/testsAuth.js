import mongoose from 'mongoose'

export const TEST_USER_ID = new mongoose.Types.ObjectId().toString()

export function stubAuthMiddleware(req, res, next) {
    req.dados = { userId: TEST_USER_ID }
    next()
}