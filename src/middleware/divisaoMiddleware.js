import Joi from 'joi'
import Capitalizar from '../utils/Capitalizar.js'

const divisaoSchema = Joi.object({
    nome: Joi.string().min(3).max(30)
        .custom((value) => Capitalizar(value))
        .required(),
    dia: Joi.string()
        .custom((value, helpers) => {
            const capitalizedValue = Capitalizar(value)
            const validDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
            if (validDays.includes(capitalizedValue)) {
                return capitalizedValue
            }
            return helpers.message(`"{{#label}}" must be one of [${validDays.join(', ')}]`)
        }, 'Validação do dia da semana')
        .required(),
}).unknown(true)

export default divisaoSchema