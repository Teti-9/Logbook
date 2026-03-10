import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import exercicioRouter from '../../src/routes/exercicio.js'
import ExercicioService from '../../src/services/exercicioService.js'

jest.mock('../../src/services/exercicioService.js')

const app = express()
app.use(express.json())

const mockExercicioService = new ExercicioService()
app.use('/api', exercicioRouter(mockExercicioService))

describe('GET /api/exercicios', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se não existir nenhum exercicio.', async () => {
        const error = new Error('Nenhum exercício encontrado.')
        error.statusCode = 404
        mockExercicioService.getExercicios.mockRejectedValue(error)

        const res = await request(app)
            .get('/api/exercicios')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Nenhum exercício encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        mockExercicioService.getExercicios.mockResolvedValue({
            _id: '699e161a8de7be224a19c494',
            nome: 'Supino Reto',
            series: 3
        })

        const res = await request(app)
            .get('/api/exercicios')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.getExercicios.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .get('/api/exercicios')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('GET /api/exercicio/:id', () => {
    const idValido = new mongoose.Types.ObjectId().toString()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se o exercício não for encontrado.', async () => {
        const error = new Error('Exercício não encontrado.')
        error.statusCode = 404
        mockExercicioService.getExercicioById.mockRejectedValue(error)

        const res = await request(app)
            .get(`/api/exercicio/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Exercício não encontrado.')
    })

    it('Deve retornar 200 para sucesso.', async () => {
        mockExercicioService.getExercicioById.mockResolvedValue({
            _id: idValido,
            nome: 'Supino Reto',
            series: 3
        })

        const res = await request(app)
            .get(`/api/exercicio/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.getExercicioById.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .get(`/api/exercicio/${idValido}`)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})

describe('POST /api/exercicio', () => {
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

        const res = await request(app)
            .post('/api/exercicio')
            .send(exercicioData)

        expect(res.status).toBe(404)
        expect(res.body.data).toBe('Divisão não encontrada.')
    })

    it('Deve criar um exercício com sucesso (201).', async () => {
        mockExercicioService.createExercicio.mockResolvedValue({
            _id: 'exercicio123',
            ...exercicioData
        })

        const res = await request(app)
            .post('/api/exercicio')
            .send(exercicioData)

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data.nome).toBe('t-bar')
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.createExercicio.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .post('/api/exercicio')
            .send(exercicioData)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })

})

describe('DELETE /api/deletar_exercicio/:id', () => {
    const idValido = new mongoose.Types.ObjectId().toString()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar 404 se o exercício não existir.', async () => {
        const error = new Error('Exercício não encontrado.')
        error.statusCode = 404
        mockExercicioService.deleteExercicio.mockRejectedValue(error)

        const res = await request(app)
            .delete(`/api/deletar_exercicio/${idValido}`)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Exercício não encontrado.')        
    })

    it('Deve retornar 200 se excluir o exercício com sucesso.', async () => {
        mockExercicioService.deleteExercicio.mockResolvedValue({ message: 'Exercício excluído com sucesso.' })

        const res = await request(app)
            .delete(`/api/deletar_exercicio/${idValido}`)

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBe('Exercício excluído com sucesso.')
    })

    it('Deve retornar 500 em caso de erro interno.', async () => {
        mockExercicioService.deleteExercicio.mockRejectedValue(new Error('Erro no banco de dados.'))

        const res = await request(app)
            .delete(`/api/deletar_exercicio/${idValido}`)

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.data).toBe('Erro no banco de dados.')
    })
})