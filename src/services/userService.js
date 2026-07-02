import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo
    }

    async createUser(body) {
        body.email = body.email.toLowerCase()
        const hashedPassword = await bcrypt.hash(body.password, 8)

        const user = {
            email: body.email,
            password: hashedPassword
        }

        await this.userRepo.create(user)

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

        const token = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.JWT_SECRET, { expiresIn: '6h' }
        )

        return `Bearer ${token}`
    }
}
