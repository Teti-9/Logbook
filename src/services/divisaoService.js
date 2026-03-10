export default class DivisaoService {
    constructor(divisaoRepository) {
        this.divisaoRepository = divisaoRepository
    }

    async getDivisoes() {
        const divisoes = await this.divisaoRepository.findAll()
        if (!divisoes || divisoes.length === 0) {
            const error = new Error('Nenhuma divisão encontrada.')
            error.statusCode = 404
            throw error
        }
        return divisoes
    }

    async getDivisaoById(id) {
        const divisao = await this.divisaoRepository.findById(id)
        if (!divisao) {
            const error = new Error('Divisão não encontrada.')
            error.statusCode = 404
            throw error
        }
        return divisao
    }

    async createDivisao(data) {
        const diaUsado = await this.divisaoRepository.findOne({ dia: data.dia })
        if (diaUsado) {
            const error = new Error('Já existe uma divisão para esse dia.')
            error.statusCode = 400
            throw error
        }
        return await this.divisaoRepository.create(data)
    }

    async deleteDivisao(id) {
        const divisaoDeletada = await this.divisaoRepository.deleteById(id)
        if (!divisaoDeletada) {
            const error = new Error('Divisão não encontrada.')
            error.statusCode = 404
            throw error
        }
        return { message: 'Divisão excluída com sucesso.' }
    }
}
