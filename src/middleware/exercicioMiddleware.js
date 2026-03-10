import Joi from 'joi'
import mongoose from 'mongoose'
import Capitalizar from '../utils/Capitalizar.js'

const exercicioSchema = Joi.object({
    nome: Joi.string().min(3).max(30).custom((value) => Capitalizar(value)).required(),
    series: Joi.number().integer().positive().required(),
    carga_anterior: Joi.number().positive(),
    carga_atual: Joi.number().positive().required(),
    repeticoes_alvo: Joi.number().integer().positive().required(),
    repeticoes_anteriores: Joi.number().positive(),
    repeticoes_atuais: Joi.number().positive().required(),
    exercicio_criado_em: Joi.date(),
    exercicio_atualizado_em: Joi.date(),
    divisao: Joi.string().custom((value, helpers) => { 
        if (!mongoose.Types.ObjectId.isValid(value)) { 
            return helpers.error('any.invalid')
        } 
        return value 
    }, 'Validação ObjectId')
    .min(1)
    .required()
}).unknown(true)

export default exercicioSchema