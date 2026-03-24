import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import logbookRouter from '../../src/routes/logbook.js'
import LogbookService from '../../src/services/logbookService.js'
import errorMiddleware from '../../src/middleware/errorMiddleware.js'
import { stubAuthMiddleware, TEST_USER_ID } from '../../src/utils/testsAuth.js'

jest.mock('../../src/services/logbookService.js')

const idValido1 = new mongoose.Types.ObjectId().toString()
const idValido2 = new mongoose.Types.ObjectId().toString()

const mockLogbookService = new LogbookService()

const app = express()
app.use(express.json())
app.use('/api/v1', stubAuthMiddleware, logbookRouter(mockLogbookService))
app.use(errorMiddleware)

describe('GET /api/v1/logerros', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se não existir nenhum logerro.', async () => {
        const error = new Error('Nenhum erro encontrado.')
        error.statusCode = 404
        mockLogbookService.getLogerros.mockRejectedValue(error)

        const res = await request(app).get('/api/v1/logerros')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhum erro encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        const payload = {
            logerros: [
                {
                    _id: '699e161a8de7be224a19c494',
                    erro: 'teste',
                    exercicio_id: { _id: '699e161a8de7be224a19c494', nome: 'Supino' }
                }
            ],
            pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
        }
        mockLogbookService.getLogerros.mockResolvedValue(payload)

        const res = await request(app).get('/api/v1/logerros')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(payload)
        expect(mockLogbookService.getLogerros).toHaveBeenCalledWith(
            { userId: TEST_USER_ID },
            { page: undefined, limit: undefined }
        )
    })

    it('Deve retornar 422 para query inválida (page).', async () => {
        const res = await request(app).get('/api/v1/logerros?page=0')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockLogbookService.getLogerros.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).get('/api/v1/logerros')

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

        const res = await request(app).get('/api/v1/logbooks')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhum logbook encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        const payload = {
            logbooks: [
                {
                    _id: 'Logbook Id: 699e161a8de7be224a19c494',
                    nome: 'Supino - 699e161a8de7be224a19c495',
                    carga: '50 ➡️ 60',
                    userId: TEST_USER_ID
                }
            ],
            pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
        }
        mockLogbookService.getLogbooks.mockResolvedValue(payload)

        const res = await request(app).get('/api/v1/logbooks')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(payload)
        expect(mockLogbookService.getLogbooks).toHaveBeenCalledWith(
            { userId: TEST_USER_ID },
            { page: undefined, limit: undefined }
        )
    })

    it('Deve retornar 422 para query inválida (page).', async () => {
        const res = await request(app).get('/api/v1/logbooks?page=0')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockLogbookService.getLogbooks.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).get('/api/v1/logbooks')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('POST /api/v1/sinclogbook', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 200 quando todos os exercícios são sincronizados.', async () => {
        const resultado = {
            total: 2,
            sincronizados: [
                { exercicioId: idValido1, status: 'ok' },
                { exercicioId: idValido2, status: 'ok' }
            ],
            falhas: []
        }
        mockLogbookService.sincLogbook.mockResolvedValue(resultado)

        const res = await request(app)
            .post('/api/v1/sinclogbook')
            .send({ exercicios: [idValido1, idValido2] })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(resultado)
        expect(mockLogbookService.sincLogbook).toHaveBeenCalledWith(
            { exercicios: [idValido1, idValido2] },
            { userId: TEST_USER_ID }
        )
    })

    it('Deve retornar 200 com falhas parciais.', async () => {
        const resultado = {
            total: 2,
            sincronizados: [{ exercicioId: idValido1, status: 'ok' }],
            falhas: [{ exercicioId: idValido2, error: 'Exercício não encontrado.' }]
        }
        mockLogbookService.sincLogbook.mockResolvedValue(resultado)

        const res = await request(app)
            .post('/api/v1/sinclogbook')
            .send({ exercicios: [idValido1, idValido2] })

        expect(res.status).toBe(200)
        expect(res.body.data.sincronizados).toHaveLength(1)
        expect(res.body.data.falhas).toHaveLength(1)
    })

    it('Deve retornar 400 quando nenhum exercício é sincronizado.', async () => {
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

    it('Deve retornar 422 quando exercicios estiver vazio.', async () => {
        const res = await request(app).post('/api/v1/sinclogbook').send({ exercicios: [] })

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })
})

describe('POST /api/v1/logbook', () => {
    const idExercicio = '699e17fbd37a44173612ae8d'

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
                exercicio: idExercicio,
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Exercício não encontrado.')
    })

    it('Deve retornar 400 em caso de já existir um logbook.', async () => {
        const error = new Error(
            'LogBook para este exercício já existe, sincronize ou apague para criar um novo.'
        )
        error.statusCode = 400
        mockLogbookService.createLogbook.mockRejectedValue(error)

        const res = await request(app)
            .post('/api/v1/logbook')
            .send({
                exercicio: idExercicio,
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe(
            'LogBook para este exercício já existe, sincronize ou apague para criar um novo.'
        )
    })

    it('Deve criar um logbook com sucesso (201).', async () => {
        const criado = { message: 'Logbook criado com sucesso.' }
        mockLogbookService.createLogbook.mockResolvedValue(criado)

        const res = await request(app)
            .post('/api/v1/logbook')
            .send({
                exercicio: idExercicio,
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(criado)
        expect(mockLogbookService.createLogbook).toHaveBeenCalledWith(
            {
                exercicio: idExercicio,
                carga: 61,
                repeticoes: 8
            },
            { userId: TEST_USER_ID }
        )
    })

    it('Deve retornar 422 para exercício com id inválido.', async () => {
        const res = await request(app)
            .post('/api/v1/logbook')
            .send({
                exercicio: 'id-invalido',
                carga: 61,
                repeticoes: 8
            })

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
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
