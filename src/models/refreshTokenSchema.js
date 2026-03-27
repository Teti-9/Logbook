import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tokenHash:   { type: String, required: true, index: true },
    expiresAt:   { type: Date, required: true },
    revoked:     { type: Boolean, default: false },
    replacedBy:  { type: String, default: null }
}, { versionKey: false, timestamps: true })

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

export default RefreshToken