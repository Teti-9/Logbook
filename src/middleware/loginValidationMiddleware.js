import Joi from 'joi'

const loginSchema = Joi.object({
    email: Joi.string().lowercase().email().required(),
    senha: Joi.string().min(4).required()
}).unknown(true)

export default loginSchema