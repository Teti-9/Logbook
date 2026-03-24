jest.mock('../../src/utils/sincronizarExercicioComLogBook.js', () => ({
    __esModule: true,
    default: jest.fn()
}))

import LogbookService from '../../src/services/logbookService.js'
import sincronizarExercicioComLogBook from '../../src/utils/sincronizarExercicioComLogBook.js'

describe('LogbookService.createLogbook', () => {
    let logbookService
    let mockLogbookRepository
    let mockExercicioRepository

    beforeEach(() => {
        jest.clearAllMocks()
        mockLogbookRepository = {
            findAll: jest.fn(),
            findAll_errors: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            create_errors: jest.fn(),
            deleteMany: jest.fn()
        }
        mockExercicioRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn()
        }
        logbookService = new LogbookService(mockLogbookRepository, mockExercicioRepository)
    })

    it('Deve lançar 404 se o exercício não existir', async () => {
        mockExercicioRepository.findById.mockResolvedValue(null)

        await expect(
            logbookService.createLogbook(
                { exercicio: 'ex-id-1', carga: 60, repeticoes: 10 },
                { userId: 'user-id-1' }
            )
        ).rejects.toMatchObject({
            statusCode: 404,
            message: 'Exercício não encontrado.'
        })

        expect(mockLogbookRepository.findOne).not.toHaveBeenCalled()
        expect(mockLogbookRepository.create).not.toHaveBeenCalled()
    })

    it('Deve lançar 400 se já existir logbook não sincronizado para o exercício', async () => {
        mockExercicioRepository.findById.mockResolvedValue({
            _id: 'ex-id-1',
            nome: 'Supino'
        })
        mockLogbookRepository.findOne.mockResolvedValue({ _id: 'lb-id-1' })

        await expect(
            logbookService.createLogbook(
                { exercicio: 'ex-id-1', carga: 60, repeticoes: 10 },
                { userId: 'user-id-1' }
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message:
                'LogBook para este exercício já existe, sincronize ou apague para criar um novo.'
        })

        expect(mockLogbookRepository.create).not.toHaveBeenCalled()
    })

    it('Deve criar logbook com sucesso', async () => {
        mockExercicioRepository.findById.mockResolvedValue({
            _id: 'ex-id-1',
            nome: 'Supino'
        })
        mockLogbookRepository.findOne.mockResolvedValue(null)
        mockLogbookRepository.create.mockResolvedValue({})

        const result = await logbookService.createLogbook(
            { exercicio: 'ex-id-1', carga: 60, repeticoes: 10 },
            { userId: 'user-id-1' }
        )

        expect(result).toEqual({ message: 'Logbook criado com sucesso.' })
        expect(mockExercicioRepository.findById).toHaveBeenCalledWith({
            _id: 'ex-id-1',
            userId: 'user-id-1'
        })
        expect(mockLogbookRepository.findOne).toHaveBeenCalledWith({
            exercicio: 'ex-id-1',
            sincronizado: false,
            userId: 'user-id-1'
        })
        expect(mockLogbookRepository.create).toHaveBeenCalledWith({
            exercicio: 'ex-id-1',
            nome: 'Supino',
            carga: 60,
            repeticoes: 10,
            userId: 'user-id-1'
        })
    })
})

describe('LogbookService.sincLogbook', () => {
    let logbookService
    let mockLogbookRepository
    let mockExercicioRepository

    beforeEach(() => {
        jest.clearAllMocks()
        mockLogbookRepository = {
            findAll: jest.fn(),
            findAll_errors: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            create_errors: jest.fn(),
            deleteMany: jest.fn()
        }
        mockExercicioRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn()
        }
        logbookService = new LogbookService(mockLogbookRepository, mockExercicioRepository)
    })

    it('Deve retornar resultado quando pelo menos uma sincronização der certo', async () => {
        sincronizarExercicioComLogBook
            .mockResolvedValueOnce({ ok: true })
            .mockRejectedValueOnce(new Error('Exercício não encontrado.'))

        const result = await logbookService.sincLogbook(
            { exercicios: ['ex-1', 'ex-2'] },
            { userId: 'user-id-1' }
        )

        expect(result.total).toBe(2)
        expect(result.sincronizados).toHaveLength(1)
        expect(result.falhas).toHaveLength(1)
        expect(mockLogbookRepository.create_errors).not.toHaveBeenCalled()
    })

    it('Deve lançar 400 quando nenhuma sincronização for bem-sucedida', async () => {
        sincronizarExercicioComLogBook.mockRejectedValue(new Error('Falha genérica'))

        await expect(
            logbookService.sincLogbook({ exercicios: ['ex-1'] }, { userId: 'user-id-1' })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Nenhuma sincronização bem-sucedida.',
            data: {
                total: 1,
                falhas: [{ exercicioId: 'ex-1', error: 'Falha genérica' }]
            }
        })

        expect(mockLogbookRepository.create_errors).toHaveBeenCalledWith({
            exercicio_id: 'ex-1',
            logbook_id: null,
            erro: 'Falha genérica'
        })
    })
})
