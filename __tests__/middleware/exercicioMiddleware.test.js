import mongoose from 'mongoose'
import exercicioSchema from '../../src/middleware/exercicioMiddleware.js'

const divisaoIdValido = new mongoose.Types.ObjectId().toString()

const payloadValido = {
    nome: 'Supino Reto',
    series: 3,
    carga_atual: 60,
    repeticoes_alvo: 10,
    repeticoes_atuais: 8,
    divisao: divisaoIdValido
}

describe('exercicioSchema', () => {
    it('Deve aceitar payload válido', () => {
        const { error, value } = exercicioSchema.validate(payloadValido)

        expect(error).toBeUndefined()
        expect(value.divisao).toBe(divisaoIdValido)
    })

    it('Deve aceitar carga_anterior e repeticoes_anteriores opcionais', () => {
        const { error } = exercicioSchema.validate({
            ...payloadValido,
            carga_anterior: 55,
            repeticoes_anteriores: 8
        })

        expect(error).toBeUndefined()
    })

    it('Deve rejeitar divisão com ObjectId inválido', () => {
        const { error } = exercicioSchema.validate({
            ...payloadValido,
            divisao: 'id-invalido'
        })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar nome com menos de 3 caracteres', () => {
        const { error } = exercicioSchema.validate({
            ...payloadValido,
            nome: 'Ab'
        })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar series não inteira ou não positiva', () => {
        const { error: e1 } = exercicioSchema.validate({ ...payloadValido, series: 0 })
        const { error: e2 } = exercicioSchema.validate({ ...payloadValido, series: 1.5 })

        expect(e1).toBeDefined()
        expect(e2).toBeDefined()
    })

    it('Deve rejeitar quando faltar campo obrigatório', () => {
        const { nome, ...semNome } = payloadValido
        const { error } = exercicioSchema.validate(semNome)

        expect(error).toBeDefined()
    })

    it('Deve ignorar chaves desconhecidas (unknown)', () => {
        const { error, value } = exercicioSchema.validate({
            ...payloadValido,
            extra: 1
        })

        expect(error).toBeUndefined()
        expect(value.extra).toBe(1)
    })
})
