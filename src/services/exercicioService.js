import { formatarData } from '../utils/formatarData.js'

export default class ExercicioService {
    constructor(exercicioRepository, divisaoRepository, logbookRepository) {
        this.exercicioRepository = exercicioRepository
        this.divisaoRepository = divisaoRepository
        this.logbookRepository = logbookRepository
    }

    async getExercicios(data) {

        const exercicios = await this.exercicioRepository.findAll({
            userId: data.userId
        })

        if (!exercicios || exercicios.length === 0) {
            const error = new Error('Nenhum exercício encontrado.')
            error.statusCode = 404
            throw error
        }

        const exerciciosFormatado = exercicios.map(item => ({
            _id: `Exercício Id: ${item._id}`,
            exercício: `${item.nome}`,
            series: `${item.series} 🗴 ${item.repeticoes_alvo}`,
            carga: `Anterior: ${item.carga_anterior} | Atual: ${item.carga_atual}`,
            repeticoes: `Anterior: ${item.repeticoes_anteriores} | Atual: ${item.repeticoes_atuais}`,
            userId: item.userId,
            createdAt: formatarData(item.createdAt),
            updatedAt: formatarData(item.updatedAt),
            divisao: item.divisao

    }))

        return exerciciosFormatado
    }

    async getExercicioById(id, data) {

        const exercicio = await this.exercicioRepository.findById({
            _id: id,
            userId: data.userId
        })

        if (!exercicio) {
            const error = new Error('Exercício não encontrado.')
            error.statusCode = 404
            throw error
        }

        const exercicioFormatado = {
            _id: `Exercício Id: ${exercicio._id}`,
            exercício: `${exercicio.nome}`,
            series: `${exercicio.series} 🗴 ${exercicio.repeticoes_alvo}`,
            carga: `Anterior: ${item.carga_anterior} | Atual: ${item.carga_atual}`,
            repeticoes: `Anterior: ${item.repeticoes_anteriores} | Atual: ${item.repeticoes_atuais}`,
            userId: exercicio.userId,
            createdAt: formatarData(exercicio.createdAt),
            updatedAt: formatarData(exercicio.updatedAt),
            divisao: exercicio.divisao
    }

        return exercicioFormatado
    }

    async createExercicio(body, data) {

        const divisaoExistente = await this.divisaoRepository.findOne({ 
            _id: body.divisao, 
            userId: data.userId})

        if (!divisaoExistente) {
            const error = new Error('Divisão não encontrada.')
            error.statusCode = 404
            throw error
        }

        const newData = {
            ...body,
            userId: data.userId
        }

        await this.exercicioRepository.create(newData)

        await this.divisaoRepository.findByIdAndUpdate(
            body.divisao,
            { $push: { exercicios: exercicioCriado._id } },
            { returnDocument: 'after' }
        )

        return { message: 'Exercício criado com sucesso.' }
    }

    async deleteExercicio(id, data) {

        const exercicioExiste = await this.exercicioRepository.findById({
            _id: id,
            userId: data.userId
        })

        if (!exercicioExiste) {
            const error = new Error("Exercício não encontrado.")
            error.statusCode = 404
            throw error
        }

        const exercicioDeletado = await this.exercicioRepository.deleteById({
            _id: id,
            userId: data.userId
        })

        if (exercicioExiste && exercicioDeletado) {

            await this.divisaoRepository.findByIdAndUpdate(
                exercicioDeletado.divisao,
                { $pull: { exercicios: exercicioDeletado._id } }
            )
            
            await this.logbookRepository.deleteMany({ exercicio: id, userId: data.userId })
        }
        
        return { message: "Exercício excluído com sucesso." }
    }
}
