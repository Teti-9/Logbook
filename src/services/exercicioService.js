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

        return exercicios
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

        return exercicio
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

        const exercicioCriado = await this.exercicioRepository.create(newData)

        await this.divisaoRepository.findByIdAndUpdate(
            body.divisao,
            { $push: { exercicios: exercicioCriado._id } },
            { returnDocument: 'after' }
        )

        return exercicioCriado
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
