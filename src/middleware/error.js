import { Prisma } from '@prisma/client'

const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500
    const errorCode = err.code
    const message = err.message || "There was an internal server error."

    if (err instanceof Prisma.PrismaClientValidationError) {
        res.status(409).json({
            success: false,
            code: errorCode,
            data: err.message
        })

    } else {
        res.status(statusCode).json({
            success: false,
            code: errorCode,
            data: message,
        })
    }

}

export default errorMiddleware