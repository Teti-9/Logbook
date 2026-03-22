import Joi from 'joi'

const paramsSchema = Joi.object({
    page: Joi.number().integer().positive(),
    limit: Joi.number().integer().positive(),
}).unknown(true)

export default paramsSchema