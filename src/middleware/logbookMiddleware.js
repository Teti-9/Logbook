import Joi from 'joi'
import mongoose from 'mongoose'

const logbookSchema = Joi.object({
    nome: Joi.string(),
    carga: Joi.number().required(),
    repeticoes: Joi.number().required(),
    data: Joi.date(),
    sincronizado: Joi.boolean(),
    exercicio: Joi.string().custom((value, helpers) => { 
        if (!mongoose.Types.ObjectId.isValid(value)) { 
            return helpers.error('any.invalid')
        } 
        return value 
    }, 'Validação ObjectId')
    .min(1)
    .required()
}).unknown(true)

export default logbookSchema