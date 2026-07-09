import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { generateRefreshToken, hashRefreshToken } from '../utils/token.js'

const ACCESS_TOKEN_TTL = '30m'
const REFRESH_TOKEN_DAYS = 30

export default class RefreshTokenService {
    constructor(userRepo, refreshRepo) {
        this.userRepo = userRepo
        this.refreshRepo = refreshRepo
    }

    async logoutUser(token) {
        const tokenHash = hashRefreshToken(token)
        const stored = await this.refreshRepo.findByHash({
            tokenHash: tokenHash
        })

        if (!stored || stored.revoked) {
            const err = new Error('Invalid refresh token.')
            err.statusCode = 401
            throw err
        }

        await this.refreshRepo.revokeByHash(tokenHash)

        return { message: 'User logged out.' }
    }

    async refreshToken(token) {
        const tokenHash = hashRefreshToken(token)
        const stored = await this.refreshRepo.findByHash({
            tokenHash: tokenHash
        })

        if (!stored || stored.expiresAt < new Date()) {
            const err = new Error('Expired refresh token.')
            err.statusCode = 401
            throw err
        }

        if (stored.revoked) {
            await this.refreshRepo.revokeUser(stored.userId)
            const err = new Error('Reused refresh token. All sessions terminated.')
            err.statusCode = 401
            throw err
        }

        const user = await this.userRepo.findUser({ id: stored.userId })

        const { tokens, newHash } = await this._tokenPair(user, { returnHash: true })

        await this.refreshRepo.revokeByHash(tokenHash, newHash)

        return tokens
    }

    async _tokenPair(user, { returnHash = false } = {}) {
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL }
        )

        const rawRefresh = generateRefreshToken()
        const newHash = hashRefreshToken(rawRefresh)
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 86400 * 1000)

        await this.refreshRepo.create({
            userId: user.id,
            tokenHash: newHash,
            expiresAt: expiresAt
        })

        const tokens = {
            accessToken: `Bearer ${accessToken}`,
            refreshToken: rawRefresh
        }

        return returnHash ? { tokens, newHash } : tokens
    }
}