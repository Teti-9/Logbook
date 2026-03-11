export default class ExercicioService {
    constructor(exercicioRepository, divisaoRepository, logbookRepository) {
        this.exercicioRepository = exercicioRepository
        this.divisaoRepository = divisaoRepository
        this.logbookRepository = logbookRepository
    }

    async getExercicios() {
        const exercicios = await this.exercicioRepository.findAll()
        if (!exercicios || exercicios.length === 0) {
            const error = new Error('Nenhum exercício encontrado.')
            error.statusCode = 404
            throw error
        }
        return exercicios
    }

    async getExercicioById(id) {
        const exercicio = await this.exercicioRepository.findById(id)
        if (!exercicio) {
            const error = new Error('Exercício não encontrado.')
            error.statusCode = 404
            throw error
        }
        return exercicio
    }

    async createExercicio(data) {
        const divisaoExistente = await this.divisaoRepository.findOne({ _id: data.divisao })
        if (!divisaoExistente) {
            const error = new Error('Divisão não encontrada.')
            error.statusCode = 404
            throw error
        }
        const exercicioCriado = await this.exercicioRepository.create(data)
        await this.divisaoRepository.findByIdAndUpdate(
            data.divisao,
            { $push: { exercicios: exercicioCriado._id } },
            { returnDocument: 'after' }
        )
        return exercicioCriado
    }

    async deleteExercicio(id) {
        const exercicioExiste = await this.exercicioRepository.findById(id)

        if (!exercicioExiste) {
            const error = new Error("Exercício não encontrado.")
            error.statusCode = 404
            throw error
        }

        const exercicioDeletado = await this.exercicioRepository.deleteById(id)

        if (exercicioExiste && exercicioDeletado) {

            await this.divisaoRepository.findByIdAndUpdate(
                exercicioDeletado.divisao,
                { $pull: { exercicios: exercicioDeletado._id } }
            )
            
            await this.logbookRepository.deleteMany({ exercicio: id })
        }
        
        return { message: "Exercício excluído com sucesso." }
    }
}
