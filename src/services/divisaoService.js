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
        const divisaoExiste = await this.divisaoRepository.findById(id)

        if (!divisaoExiste) {
            const error = new Error('Divisão não encontrada.')
            error.statusCode = 404
            throw error           
        }

        if (divisaoExiste.exercicios.length > 0) {
            const error = new Error('Não é possível excluir uma divisão com exercícios associados.')
            error.statusCode = 400
            throw error
        }

        await this.divisaoRepository.deleteById(id)

        return { message: 'Divisão excluída com sucesso.' }
    }
}
