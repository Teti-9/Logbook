import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import exercicioRouter from '../../src/routes/exercicio.js'
import ExercicioService from '../../src/services/exercicioService.js'
import errorMiddleware from '../../src/middleware/errorMiddleware.js'
import { stubAuthMiddleware, TEST_USER_ID } from '../../src/utils/testsAuth.js'

jest.mock('../../src/services/exercicioService.js')

const mockExercicioService = new ExercicioService()

const app = express()
app.use(express.json())
app.use('/api/v1', stubAuthMiddleware, exercicioRouter(mockExercicioService))
app.use(errorMiddleware)

describe('GET /api/v1/exercicios', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se não existir nenhum exercicio.', async () => {
        const error = new Error('Nenhum exercício encontrado.')
        error.statusCode = 404
        mockExercicioService.getExercicios.mockRejectedValue(error)

        const res = await request(app).get('/api/v1/exercicios')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhum exercício encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        const payload = {
            exercicios: [
                {
                    _id: 'Exercício Id: 699e161a8de7be224a19c494',
                    exercício: 'Supino Reto',
                    series: '3 🗴 10',
                    userId: TEST_USER_ID
                }
            ],
            pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
        }
        mockExercicioService.getExercicios.mockResolvedValue(payload)

        const res = await request(app).get('/api/v1/exercicios')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(payload)
        expect(mockExercicioService.getExercicios).toHaveBeenCalledWith(
            { userId: TEST_USER_ID },
            { page: undefined, limit: undefined }
        )
    })

    it('Deve retornar 422 para query inválida (page).', async () => {
        const res = await request(app).get('/api/v1/exercicios?page=0')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.getExercicios.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).get('/api/v1/exercicios')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('GET /api/v1/exercicio/:id', () => {
    const idValido = new mongoose.Types.ObjectId().toString()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se o exercício não for encontrado.', async () => {
        const error = new Error('Exercício não encontrado.')
        error.statusCode = 404
        mockExercicioService.getExercicioById.mockRejectedValue(error)

        const res = await request(app).get(`/api/v1/exercicio/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Exercício não encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        const payload = {
            _id: `Exercício Id: ${idValido}`,
            exercício: 'Supino Reto',
            series: '3 🗴 10',
            userId: TEST_USER_ID
        }
        mockExercicioService.getExercicioById.mockResolvedValue(payload)

        const res = await request(app).get(`/api/v1/exercicio/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(payload)
        expect(mockExercicioService.getExercicioById).toHaveBeenCalledWith(idValido, {
            userId: TEST_USER_ID
        })
    })

    it('Deve retornar 422 se o id não for um ObjectId válido.', async () => {
        const res = await request(app).get('/api/v1/exercicio/id-invalido')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.getExercicioById.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).get(`/api/v1/exercicio/${idValido}`)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('POST /api/v1/exercicio', () => {
    const idDivisao = new mongoose.Types.ObjectId().toString()
    const exercicioData = {
        nome: 't-bar',
        series: 2,
        repeticoes_alvo: 8,
        carga_atual: 60,
        repeticoes_atuais: 8,
        divisao: idDivisao
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 em caso de não existir uma divisão.', async () => {
        const error = new Error('Divisão não encontrada.')
        error.statusCode = 404
        mockExercicioService.createExercicio.mockRejectedValue(error)

        const res = await request(app).post('/api/v1/exercicio').send(exercicioData)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Divisão não encontrada.')
    })

    it('Deve criar um exercício com sucesso (201).', async () => {
        const criado = { message: 'Exercício criado com sucesso.' }
        mockExercicioService.createExercicio.mockResolvedValue(criado)

        const res = await request(app).post('/api/v1/exercicio').send(exercicioData)

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(criado)
        expect(mockExercicioService.createExercicio).toHaveBeenCalledWith(
            expect.objectContaining({
                divisao: idDivisao,
                series: 2
            }),
            { userId: TEST_USER_ID }
        )
    })

    it('Deve retornar 422 para corpo inválido.', async () => {
        const res = await request(app)
            .post('/api/v1/exercicio')
            .send({ nome: 'tb', series: 2, divisao: idDivisao })

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.createExercicio.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).post('/api/v1/exercicio').send(exercicioData)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('DELETE /api/v1/deletar_exercicio/:id', () => {
    const idValido = new mongoose.Types.ObjectId().toString()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se o exercício não existir.', async () => {
        const error = new Error('Exercício não encontrado.')
        error.statusCode = 404
        mockExercicioService.deleteExercicio.mockRejectedValue(error)

        const res = await request(app).delete(`/api/v1/deletar_exercicio/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Exercício não encontrado.')
    })

    it('Deve retornar 200 se excluir o exercício com sucesso.', async () => {
        const excluido = { message: 'Exercício excluído com sucesso.' }
        mockExercicioService.deleteExercicio.mockResolvedValue(excluido)

        const res = await request(app).delete(`/api/v1/deletar_exercicio/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toEqual(excluido)
        expect(mockExercicioService.deleteExercicio).toHaveBeenCalledWith(idValido, {
            userId: TEST_USER_ID
        })
    })

    it('Deve retornar 422 se o id não for um ObjectId válido.', async () => {
        const res = await request(app).delete('/api/v1/deletar_exercicio/invalido')

        expect(res.status).toBe(422)
        expect(res.body.success).toBe(false)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.deleteExercicio.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app).delete(`/api/v1/deletar_exercicio/${idValido}`)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})
