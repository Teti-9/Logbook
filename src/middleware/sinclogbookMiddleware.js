import Joi from 'joi'
import mongoose from 'mongoose'

const sinclogbookSchema = Joi.object({
    exercicios: Joi.array()
        .items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error('any.invalid')
                }
                return value
            }, 'Validação ObjectId')
        )
        .min(1)
        .required()
}).unknown(true)

export default sinclogbookSchema