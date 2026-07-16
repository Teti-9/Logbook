import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default class UserService {
    constructor(userRepo, refreshTokenService) {
        this.userRepo = userRepo
        this.refreshTokenService = refreshTokenService
    }

    async createUser(body) {

        const lowercaseEmail = body.email.toLowerCase()
        const hashedPassword = await bcrypt.hash(body.password, 8)

        const user = {
            email: lowercaseEmail,
            password: hashedPassword
        }

        const createdUser = await this.userRepo.create(user)

        return { message: 'User successfully created.' }
    }

    async loginUser(body) {
        body.email = body.email.toLowerCase()
        const user = await this.userRepo.findUser({
            email: body.email
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
