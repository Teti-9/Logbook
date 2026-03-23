import Joi from 'joi'
import Capitalizar from '../utils/Capitalizar.js'

const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).max(30).custom((value) => Capitalizar(value)).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(4).required()
}).unknown(true)

export default usuarioSchema