import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import logbookRouter from '../../src/routes/logbook.js'
import LogbookService from '../../src/services/logbookService.js'
import errorMiddleware from '../../src/middleware/errorMiddleware.js'

jest.mock('../../src/services/logbookService.js')

const app = express()
app.use(express.json())

const idValido1 = new mongoose.Types.ObjectId().toString()
const idValido2 = new mongoose.Types.ObjectId().toString()

const mockLogbookService = new LogbookService()
app.use('/api/v1', logbookRouter(mockLogbookService))
app.use(errorMiddleware)

describe('GET /api/v1/logerros', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se não existir nenhum logerro.', async () => {
        const error = new Error('Nenhum erro encontrado.')
        error.statusCode = 404
        mockLogbookService.getLogerros.mockRejectedValue(error)

        const res = await request(app)
            .get('/api/v1/logerros')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhum erro encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        mockLogbookService.getLogerros.mockResolvedValue({
            exercicio_id: '699e161a8de7be224a19c494',
            erro: 'teste',
            data: new Date(),
            resolvido: false,
            logbook_id: '699e161a8de7be224a19c494'
        })

        const res = await request(app)
            .get('/api/v1/logerros')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockLogbookService.getLogerros.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .get('/api/v1/logerros')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('GET /api/v1/logbooks', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se não existir nenhum logbook.', async () => {
        const error = new Error('Nenhum logbook encontrado.')
        error.statusCode = 404
        mockLogbookService.getLogbooks.mockRejectedValue(error)

        const res = await request(app)
            .get('/api/v1/logbooks')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhum logbook encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        mockLogbookService.getLogbooks.mockResolvedValue({
            exercicio: '699e161a8de7be224a19c494',
            carga_anterior: 50,
            repeticoes_anteriores: 8
        })

        const res = await request(app)
            .get('/api/v1/logbooks')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockLogbookService.getLogbooks.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .get('/api/v1/logbooks')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('POST /api/v1/sinclogbook', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Retorna 200 quando todos os exercícios são sincronizados.', async () => {
        mockLogbookService.sincLogbook.mockResolvedValue({
            total: 2,
            sincronizados: [{ exercicioId: idValido1, status: 'ok' }, { exercicioId: idValido2, status: 'ok' }],
            falhas: []
        })

        const res = await request(app)
            .post('/api/v1/sinclogbook')
            .send({ exercicios: [idValido1, idValido2] })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data.total).toBe(2)
        expect(res.body.data.sincronizados).toHaveLength(2)
        expect(res.body.data.falhas).toHaveLength(0)
    })

    it('Retorna 200 com falhas.', async () => {
        mockLogbookService.sincLogbook.mockResolvedValue({
            total: 2,
            sincronizados: [{ exercicioId: idValido1, status: 'ok' }],
            falhas: [{ exercicioId: idValido2, error: 'Exercício não encontrado.' }]
        })

        const res = await request(app)
            .post('/api/v1/sinclogbook')
            .send({ exercicios: [idValido1, idValido2] })

        expect(res.status).toBe(200)
        expect(res.body.data.sincronizados).toHaveLength(1)
        expect(res.body.data.falhas).toHaveLength(1)
    })

    it('Retorna 400 quando nenhum exercício é sincronizado.', async () => {
        const error = new Error('Nenhuma sincronização bem-sucedida.')
        error.statusCode = 400
        error.data = {
            total: 1,
            falhas: [{ exercicioId: idValido1, error: 'Exercício não encontrado.' }]
        }
        mockLogbookService.sincLogbook.mockRejectedValue(error)

        const res = await request(app)
            .post('/api/v1/sinclogbook')
            .send({ exercicios: [idValido1] })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhuma sincronização bem-sucedida.')
    })
})

describe('POST /api/v1/logbook', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 em caso de não existir um exercício.', async () => {
        const error = new Error('Exercício não encontrado.')
        error.statusCode = 404
        mockLogbookService.createLogbook.mockRejectedValue(error)

        const res = await request(app)
            .post('/api/v1/logbook')
            .send({
                exercicio: '699e17fbd37a44173612ae8d',
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Exercício não encontrado.')
    })

    it('Deve retornar 400 em caso de já existir um logbook.', async () => {
        const error = new Error('LogBook para este exercício já existe, sincronize ou apague para criar um novo.')
        error.statusCode = 400
        mockLogbookService.createLogbook.mockRejectedValue(error)

        const res = await request(app)
            .post('/api/v1/logbook')
            .send({
                exercicio: '699e17fbd37a44173612ae8d',
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('LogBook para este exercício já existe, sincronize ou apague para criar um novo.')
    })

    it('Deve criar um logbook com sucesso (201).', async () => {
        const idValido = '699e17fbd37a44173612ae8d'
        mockLogbookService.createLogbook.mockResolvedValue({
            exercicio: idValido,
            carga: 61,
            repeticoes: 8
        })

        const res = await request(app)
            .post('/api/v1/logbook')
            .send({
                exercicio: idValido,
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockLogbookService.createLogbook.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .post('/api/v1/logbook')
            .send({
                exercicio: '699e1821d37a44173612ae93',
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})