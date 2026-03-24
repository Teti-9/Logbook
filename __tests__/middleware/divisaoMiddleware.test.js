import divisaoSchema from '../../src/middleware/divisaoMiddleware.js'

describe('divisaoSchema', () => {
    it('Deve aceitar nome e dia válidos', () => {
        const { error, value } = divisaoSchema.validate({
            nome: 'Push',
            dia: 'Segunda'
        })

        expect(error).toBeUndefined()
        expect(value.dia).toBe('Segunda')
    })

    it('Deve normalizar o dia com capitalização (ex.: segunda → Segunda)', () => {
        const { error, value } = divisaoSchema.validate({
            nome: 'Push',
            dia: 'segunda'
        })

        expect(error).toBeUndefined()
        expect(value.dia).toBe('Segunda')
    })

    it('Deve rejeitar dia inválido', () => {
        const { error } = divisaoSchema.validate({ nome: 'Push', dia: 'Funday' })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar nome com menos de 3 caracteres', () => {
        const { error } = divisaoSchema.validate({ nome: 'Pu', dia: 'Segunda' })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar nome com mais de 30 caracteres', () => {
        const { error } = divisaoSchema.validate({
            nome: 'A'.repeat(31),
            dia: 'Segunda'
        })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar quando nome estiver ausente', () => {
        const { error } = divisaoSchema.validate({ dia: 'Segunda' })

        expect(error).toBeDefined()
    })

    it('Deve rejeitar quando dia estiver ausente', () => {
        const { error } = divisaoSchema.validate({ nome: 'Push' })

        expect(error).toBeDefined()
    })

    it('Deve ignorar chaves desconhecidas (unknown)', () => {
        const { error, value } = divisaoSchema.validate({
            nome: 'Push',
            dia: 'Terça',
            extra: 'ignored'
        })

        expect(error).toBeUndefined()
        expect(value.extra).toBe('ignored')
    })
})
