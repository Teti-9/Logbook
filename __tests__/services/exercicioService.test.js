import ExercicioService from '../../src/services/exercicioService.js'

describe('ExercicioService.createExercicio', () => {
    let exercicioService
    let mockExercicioRepository
    let mockDivisaoRepository
    let mockLogbookRepository

    beforeEach(() => {
        mockExercicioRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn()
        }
        mockDivisaoRepository = {
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn()
        }
        mockLogbookRepository = {
            deleteMany: jest.fn()
        }
        exercicioService = new ExercicioService(
            mockExercicioRepository,
            mockDivisaoRepository,
            mockLogbookRepository
        )
    })

    it('Deve lançar 404 se a divisão não existir', async () => {
        mockDivisaoRepository.findOne.mockResolvedValue(null)

        await expect(
            exercicioService.createExercicio(
                { nome: 'Supino', divisao: 'div-id-1' },
                { userId: 'user-id-1' }
            )
        ).rejects.toMatchObject({
            statusCode: 404,
            message: 'Divisão não encontrada.'
        })

        expect(mockExercicioRepository.create).not.toHaveBeenCalled()
    })

    it('Deve criar exercício e atualizar a divisão', async () => {
        mockDivisaoRepository.findOne.mockResolvedValue({ _id: 'div-id-1', nome: 'Push' })
        mockExercicioRepository.create.mockResolvedValue({ _id: 'ex-id-1', nome: 'Supino' })

        const result = await exercicioService.createExercicio(
            { nome: 'Supino', divisao: 'div-id-1' },
            { userId: 'user-id-1' }
        )

        expect(result).toEqual({ message: 'Exercício criado com sucesso.' })
        expect(mockDivisaoRepository.findOne).toHaveBeenCalledWith({
            _id: 'div-id-1',
            userId: 'user-id-1',
            isDeleted: false
        })
        expect(mockExercicioRepository.create).toHaveBeenCalledWith({
            nome: 'Supino',
            divisao: 'div-id-1',
            userId: 'user-id-1'
        })
        expect(mockDivisaoRepository.findByIdAndUpdate).toHaveBeenCalledWith(
            'div-id-1',
            { $push: { exercicios: 'ex-id-1' } },
            { returnDocument: 'after' }
        )
    })
})
