import { Prisma } from '@prisma/client'

const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500
    const message = err.message || "There was a internal server error."

    if (err instanceof Prisma.PrismaClientValidationError) {
        res.status(409).json({
            success: false,
            data: 'Invalid data sent, please check the fields again.'
        })

    } else {
        res.status(statusCode).json({
            success: false,
            data: message,
        })
    }

}

export default errorMiddleware