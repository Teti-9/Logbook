import { formatarData } from '../utils/formatarData.js' 

export default class DivisaoService {
    constructor(divisaoRepository) {
        this.divisaoRepository = divisaoRepository
    }

    async getDivisoes(data, { page = 1, limit = 10 } = {}) {

        const { divisoes, total } = await this.divisaoRepository.findAll(
            { userId: data.userId, isDeleted: false },
            { page, limit }
        )

        if (!divisoes || divisoes.length === 0) {
            const error = new Error('Nenhuma divisão encontrada.')
            error.statusCode = 404
            throw error
        }

        const divisoesFormatadas = divisoes.map(item => ({
            _id: `Divisão Id: ${item._id}`,
            divisão: `${item.nome} 🗴 ${item.dia}`,
            userId: item.userId,
            createdAt: formatarData(item.createdAt),
            updatedAt: formatarData(item.updatedAt),
            exercicios: item.exercicios

    }))
        
        return {
            divisoes: divisoesFormatadas,
            pagination: {
                total,
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                totalPages: Math.ceil(total / (Number(limit) || 10))
            }
        }
    }

    async getDivisaoById(id, data) {

        const divisao = await this.divisaoRepository.findById({ 
            _id: id, 
            userId: data.userId,
            isDeleted: false
        })

        if (!divisao) {
            const error = new Error('Divisão não encontrada.')
            error.statusCode = 404
            throw error
        }

        const divisaoFormatada = {
            _id: `Divisão Id: ${divisao._id}`,
            divisão: `${divisao.nome} 🗴 ${divisao.dia}`,
            userId: divisao.userId,
            createdAt: formatarData(divisao.createdAt),
            updatedAt: formatarData(divisao.updatedAt),
            exercicios: divisao.exercicios
        }

        return divisaoFormatada
    }

    async createDivisao(body, data) {

        const diaUsado = await this.divisaoRepository.findOne({ 
            dia: body.dia, 
            userId: data.userId,
            isDeleted: false
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

        await this.divisaoRepository.create(newData)

        return { message: 'Divisão criada com sucesso.' }
    }

    async deleteDivisao(id, data) {

        const divisaoExiste = await this.divisaoRepository.findById({
            _id: id,
            userId: data.userId,
            isDeleted: false
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

        await this.divisaoRepository.findByIdAndUpdate(
            id,
            { isDeleted: true, deletedAt: new Date() },
            { returnDocument: 'after' }
        )

        return { message: 'Divisão excluída com sucesso.' }
    }
}
