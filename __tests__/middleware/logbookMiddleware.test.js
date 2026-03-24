import mongoose from 'mongoose'
import logbookSchema from '../../src/middleware/logbookMiddleware.js'
import sinclogbookSchema from '../../src/middleware/sinclogbookMiddleware.js'

const exercicioIdValido = new mongoose.Types.ObjectId().toString()
const outroId = new mongoose.Types.ObjectId().toString()

describe('logbookSchema', () => {
    const payloadValido = {
        exercicio: exercicioIdValido,
        carga: 61,
        repeticoes: 8
    }

    it('Deve aceitar exercicio, carga e repeticoes', () => {
        const { error, value } = logbookSchema.validate(payloadValido)

        expect(error).toBeUndefined()
        expect(value.exercicio).toBe(exercicioIdValido)
    })

    it('Deve aceitar campos opcionais (nome, data, sincronizado)', () => {
        const { error } = logbookSchema.validate({
            ...payloadValido,
            nome: 'Treino A',
            sincronizado: false
        })

        expect(error).toBeUndefined()
    })

    it('Deve rejeitar exercicio com ObjectId inválido', () => {
        const { error } = logbookSchema.validate({
            ...payloadValido,
            exercicio: 'não-é-um-id'
        })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar quando faltar carga ou repeticoes', () => {
        const { error: semCarga } = logbookSchema.validate({
            exercicio: exercicioIdValido,
            repeticoes: 8
        })
        const { error: semReps } = logbookSchema.validate({
            exercicio: exercicioIdValido,
            carga: 61
        })

        expect(semCarga).toBeDefined()
        expect(semReps).toBeDefined()
    })

    it('Deve ignorar chaves desconhecidas (unknown)', () => {
        const { error, value } = logbookSchema.validate({
            ...payloadValido,
            extra: true
        })

        expect(error).toBeUndefined()
        expect(value.extra).toBe(true)
    })
})

describe('sinclogbookSchema', () => {
    it('Deve aceitar array com um ou mais ObjectIds válidos', () => {
        const { error, value } = sinclogbookSchema.validate({
            exercicios: [exercicioIdValido, outroId]
        })

        expect(error).toBeUndefined()
        expect(value.exercicios).toHaveLength(2)
    })

    it('Deve rejeitar array vazio', () => {
        const { error } = sinclogbookSchema.validate({ exercicios: [] })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar quando exercicios estiver ausente', () => {
        const { error } = sinclogbookSchema.validate({})

        expect(error).toBeDefined()
    })

    it('Deve rejeitar id inválido dentro do array', () => {
        const { error } = sinclogbookSchema.validate({
            exercicios: [exercicioIdValido, 'invalido']
        })

        expect(error).toBeDefined()
    })
})
