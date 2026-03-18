import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import divisaoRouter from '../../src/routes/divisao.js'
import DivisaoService from '../../src/services/divisaoService.js'
import errorMiddleware from '../../src/middleware/errorMiddleware.js'

jest.mock('../../src/services/divisaoService.js')

const app = express()
app.use(express.json())

const mockDivisaoService = new DivisaoService()
app.use('/api/v1', divisaoRouter(mockDivisaoService))
app.use(errorMiddleware)

describe('GET /api/v1/divisoes', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se não existir nenhuma divisão.', async () => {
        const error = new Error('Nenhuma divisão encontrada.')
        error.statusCode = 404
        mockDivisaoService.getDivisoes.mockRejectedValue(error)

        const res = await request(app)
            .get('/api/v1/divisoes')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhuma divisão encontrada.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        mockDivisaoService.getDivisoes.mockResolvedValue({
            _id: '699e161a8de7be224a19c494',
            nome: 'Push 1',
            dia: 'Segunda'
        })

        const res = await request(app)
            .get('/api/v1/divisoes')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockDivisaoService.getDivisoes.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .get('/api/v1/divisoes')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('GET /api/v1/divisao/:id', () => {
    const idValido = new mongoose.Types.ObjectId().toString()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se a divisão não for encontrada.', async () => {
        const error = new Error('Divisão não encontrada.')
        error.statusCode = 404
        mockDivisaoService.getDivisaoById.mockRejectedValue(error)

        const res = await request(app)
            .get(`/api/v1/divisao/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Divisão não encontrada.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        mockDivisaoService.getDivisaoById.mockResolvedValue({
            _id: idValido,
            nome: 'Push 1',
            dia: 'Segunda'
        })

        const res = await request(app)
            .get(`/api/v1/divisao/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockDivisaoService.getDivisaoById.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .get(`/api/v1/divisao/${idValido}`)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('POST /api/v1/divisao', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 400 se já existir uma divisão para o dia.', async () => {
        const error = new Error('Já existe uma divisão para esse dia.')
        error.statusCode = 400
        mockDivisaoService.createDivisao.mockRejectedValue(error)

        const res = await request(app)
            .post('/api/v1/divisao')
            .send({ nome: 'Push 1', dia: 'Segunda' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Já existe uma divisão para esse dia.')
    })

    it('Deve criar uma divisão com sucesso (201).', async () => {
        mockDivisaoService.createDivisao.mockResolvedValue({
            nome: 'Push 1',
            dia: 'Segunda'
        })

        const res = await request(app)
            .post('/api/v1/divisao')
            .send({ nome: 'Push 1', dia: 'Segunda' })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockDivisaoService.createDivisao.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .post('/api/v1/divisao')
            .send({ nome: 'Push 1', dia: 'Segunda' })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })

})

describe('DELETE /api/v1/deletar_divisao/:id', () => {
    const idValido = new mongoose.Types.ObjectId().toString()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se a divisão não existir.', async () => {
        const error = new Error('Divisão não encontrada.')
        error.statusCode = 404
        mockDivisaoService.deleteDivisao.mockRejectedValue(error)

        const res = await request(app)
            .delete(`/api/v1/deletar_divisao/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Divisão não encontrada.')
    })

    it('Deve retornar 200 se excluir a divisão com sucesso.', async () => {
        mockDivisaoService.deleteDivisao.mockResolvedValue({ message: 'Divisão excluída com sucesso.' })

        const res = await request(app)
            .delete(`/api/v1/deletar_divisao/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toStrictEqual({message: "Divisão excluída com sucesso."})
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockDivisaoService.deleteDivisao.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .delete(`/api/v1/deletar_divisao/${idValido}`)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})