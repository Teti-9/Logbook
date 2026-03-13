export default class DivisaoService {
    constructor(divisaoRepository) {
        this.divisaoRepository = divisaoRepository
    }

    async getDivisoes(data) {

        const divisoes = await this.divisaoRepository.findAll({ 
            userId: data.userId 
        })

        if (!divisoes || divisoes.length === 0) {
            const error = new Error('Nenhuma divisão encontrada.')
            error.statusCode = 404
            throw error
        }
        
        return divisoes
    }

    async getDivisaoById(id, data) {

        const divisao = await this.divisaoRepository.findById({ 
            _id: id, 
            userId: data.userId 
        })

        if (!divisao) {
            const error = new Error('Divisão não encontrada.')
            error.statusCode = 404
            throw error
        }

        return divisao
    }

    async createDivisao(body, data) {

        const diaUsado = await this.divisaoRepository.findOne({ 
            dia: body.dia, 
            userId: data.userId 
        })

        if (diaUsado) {
            const error = new Error('Já existe uma divisão para esse dia.')
            error.statusCode = 400
            throw error
        }

        const newData = {
            ...body,
            userId: data.userId
        }

        return await this.divisaoRepository.create(newData)
    }

    async deleteDivisao(id, data) {

        const divisaoExiste = await this.divisaoRepository.findById({
            _id: id,
            userId: data.userId
        })

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

        await this.divisaoRepository.deleteById({
            _id: id,
            userId: data.userId
        })

        return { message: 'Divisão excluída com sucesso.' }
    }
}
