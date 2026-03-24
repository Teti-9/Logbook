import DivisaoService from '../../src/services/divisaoService.js'

describe('DivisaoService.createDivisao', () => {
    let divisaoService
    let mockDivisaoRepository

    beforeEach(() => {
        mockDivisaoRepository = {
            findOne: jest.fn(),
            create: jest.fn()
        }
        divisaoService = new DivisaoService(mockDivisaoRepository)
    })

    it('Deve lançar 400 se já existir divisão para o dia', async () => {
        mockDivisaoRepository.findOne.mockResolvedValue({ dia: 'Segunda' })

        await expect(
            divisaoService.createDivisao(
                { nome: 'Push', dia: 'Segunda' },
                { userId: 'user-id-1' }
            )
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Já existe uma divisão para esse dia.'
        })

        expect(mockDivisaoRepository.create).not.toHaveBeenCalled()
    })

    it('Deve criar divisão com sucesso', async () => {
        mockDivisaoRepository.findOne.mockResolvedValue(null)
        mockDivisaoRepository.create.mockResolvedValue({ nome: 'Push', dia: 'Segunda' })

        const result = await divisaoService.createDivisao(
            { nome: 'Push', dia: 'Segunda' },
            { userId: 'user-id-1' }
        )

        expect(result).toEqual({ message: 'Divisão criada com sucesso.' })
        expect(mockDivisaoRepository.findOne).toHaveBeenCalledWith({
            dia: 'Segunda',
            userId: 'user-id-1',
            isDeleted: false
        })
        expect(mockDivisaoRepository.create).toHaveBeenCalledWith({
            nome: 'Push',
            dia: 'Segunda',
            userId: 'user-id-1'
        })
    })
})
