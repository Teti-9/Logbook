import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import divisaoRouter from '../../src/routes/divisao.js'
import DivisaoService from '../../src/services/divisaoService.js'
import errorMiddleware from '../../src/middleware/errorMiddleware.js'
import { stubAuthMiddleware, TEST_USER_ID } from '../../src/utils/testsAuth.js'

jest.mock('../../src/services/divisaoService.js')

const mockDivisaoService = new DivisaoService()

const app = express()
app.use(express.json())
app.use('/api/v1', stubAuthMiddleware, divisaoRouter(mockDivisaoService))
app.use(errorMiddleware)

describe('GET /api/v1/divisoes', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se não existir nenhuma divisão.', async () => {
        const error = new Error('Nenhuma divisão encontrada.')
        error.statusCode = 404
        mockDivisaoService.getDivisoes.mockRejectedValue(error)

        const res = await request(app).get('/api/v1/divisoes')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhuma divisão encontrada.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        const payload = {
            divisoes: [
                {
                    _id: 'Divisão Id: 699e161a8de7be224a19c494',
                    divisão: 'Push 1 🗴 Segunda',
                    userId: TEST_USER_ID
                }
            ],
            pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
        }
        mockDivisaoService.getDivisoes.mockResolvedValue(payload)

        const res = await request(app).get('/api/v1/divisoes')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(payload)
        expect(mockDivisaoService.getDivisoes).toHaveBeenCalledWith(
            { userId: TEST_USER_ID },
            { page: undefined, limit: undefined }
        )
    })

    it('Deve retornar 422 para query inválida (page).', async () => {
        const res = await request(app).get('/api/v1/divisoes?page=0')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
        expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockDivisaoService.getDivisoes.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).get('/api/v1/divisoes')

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

        const res = await request(app).get(`/api/v1/divisao/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Divisão não encontrada.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        const payload = {
            _id: `Divisão Id: ${idValido}`,
            divisão: 'Push 1 🗴 Segunda',
            userId: TEST_USER_ID
        }
        mockDivisaoService.getDivisaoById.mockResolvedValue(payload)

        const res = await request(app).get(`/api/v1/divisao/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(payload)
        expect(mockDivisaoService.getDivisaoById).toHaveBeenCalledWith(idValido, {
            userId: TEST_USER_ID
        })
    })

    it('Deve retornar 422 se o id não for um ObjectId válido.', async () => {
        const res = await request(app).get('/api/v1/divisao/id-invalido')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockDivisaoService.getDivisaoById.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).get(`/api/v1/divisao/${idValido}`)

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
        const criado = { message: 'Divisão criada com sucesso.' }
        mockDivisaoService.createDivisao.mockResolvedValue(criado)

        const res = await request(app)
            .post('/api/v1/divisao')
            .send({ nome: 'Push 1', dia: 'Segunda' })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(criado)
        expect(mockDivisaoService.createDivisao).toHaveBeenCalledWith(
            expect.objectContaining({ nome: 'Push 1', dia: 'Segunda' }),
            { userId: TEST_USER_ID }
        )
    })

    it('Deve retornar 422 para corpo inválido.', async () => {
        const res = await request(app).post('/api/v1/divisao').send({ nome: 'Ab', dia: 'Segunda' })

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
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

        const res = await request(app).delete(`/api/v1/deletar_divisao/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Divisão não encontrada.')
    })

    it('Deve retornar 400 se a divisão tiver exercícios associados.', async () => {
        const error = new Error('Não é possível excluir uma divisão com exercícios associados.')
        error.statusCode = 400
        mockDivisaoService.deleteDivisao.mockRejectedValue(error)

        const res = await request(app).delete(`/api/v1/deletar_divisao/${idValido}`)

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Não é possível excluir uma divisão com exercícios associados.')
    })

    it('Deve retornar 200 se excluir a divisão com sucesso.', async () => {
        const excluido = { message: 'Divisão excluída com sucesso.' }
        mockDivisaoService.deleteDivisao.mockResolvedValue(excluido)

        const res = await request(app).delete(`/api/v1/deletar_divisao/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(excluido)
        expect(mockDivisaoService.deleteDivisao).toHaveBeenCalledWith(idValido, {
            userId: TEST_USER_ID
        })
    })

    it('Deve retornar 422 se o id não for um ObjectId válido.', async () => {
        const res = await request(app).delete('/api/v1/deletar_divisao/invalido')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockDivisaoService.deleteDivisao.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).delete(`/api/v1/deletar_divisao/${idValido}`)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})
