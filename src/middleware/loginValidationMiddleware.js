import Joi from 'joi'

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(4).required()
}).unknown(true)

export default loginSchema