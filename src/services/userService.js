import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default class UserService {
    constructor(userRepo, refreshTokenService) {
        this.userRepo = userRepo
        this.refreshTokenService = refreshTokenService
    }

    async getUserById(id) {
        const userId = Number(id)

        const user = await this.userRepo.findUser({
            id: userId,
            isDeleted: false
        })

        if (!user) {
            const error = new Error('User not found.')
            error.statusCode = 404
            throw error
        }

        const { password, ...safeUser } = user

        return safeUser
    }

    async createUser(body) {
        const lowercaseEmail = body.email.toLowerCase()

        const userExists = await this.userRepo.findUser({
            email: lowercaseEmail,
            isDeleted: false
        })

        if (userExists) {
            const error = new Error('Email already in use.')
            error.statusCode = 409
            throw error
        }

        const hashedPassword = await bcrypt.hash(body.password, 8)

        const user = {
            email: lowercaseEmail,
            password: hashedPassword
        }

        const createdUser = await this.userRepo.create(user)

        return { message: 'User successfully created.' }
    }

    async loginUser(body) {
        const lowercaseEmail = body.email.toLowerCase()

        const user = await this.userRepo.findUser({
            email: lowercaseEmail
        })

        if (!user) {
            const error = new Error('Email not found.')
            error.statusCode = 404
            throw error
        }

        const validPassword = await bcrypt.compare(body.password, user.password)

        if (!validPassword) {
            const error = new Error('Invalid password.')
            error.statusCode = 401
            throw error
        }

        return this.refreshTokenService._tokenPair(user)
    }
}
