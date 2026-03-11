import sincronizarExercicioComLogBook from '../utils/sincronizarExercicioComLogBook.js'

export default class LogbookService {
    constructor(logbookRepository, exercicioRepository) {
        this.logbookRepository = logbookRepository
        this.exercicioRepository = exercicioRepository
    }

    async getLogerros() {
        const logerros = await this.logbookRepository.findAll_errors({resolvido: false})
        if (!logerros || logerros.length === 0) {
            const error = new Error("Nenhum erro encontrado.")
            error.statusCode = 404
            throw error
        }
        return logerros
    }

    async getLogbooks() {
        const logbooks = await this.logbookRepository.findAll()
        if (!logbooks || logbooks.length === 0) {
            const error = new Error("Nenhum logbook encontrado.")
            error.statusCode = 404
            throw error
        }
        return logbooks
    }

    async sincLogbook(data) {

        const { exercicios } = data

        const sincronizados = []
        const falhas = []
        const ERROS_SEM_LOG = [
            'Exercício não encontrado.',
            'Logbook não encontrado para este exercício.'
        ]

        for (const exercicioId of exercicios) {

            try {

                const sincResultado = await sincronizarExercicioComLogBook(exercicioId)
                sincronizados.push(sincResultado)

            } catch (error) {

                falhas.push({
                    exercicioId,
                    error: error.message
                })

                if (!ERROS_SEM_LOG.includes(error.message)) {
                    await logbookRepository.create_errors({
                        exercicio_id: exercicioId,
                        logbook_id: error.logbook_id ?? null,
                        erro: error.message
                    })
                }
            }
        }

        if (sincronizados.length === 0) {
            const error = new Error('Nenhuma sincronização bem-sucedida.')
            error.statusCode = 400
            error.data = {
                total: falhas.length,
                falhas
            }
            throw error
        }

        return {
            total: sincronizados.length + falhas.length,
            sincronizados,
            falhas
        }
    }

    async createLogbook(data) {
        const exercicioExiste = await this.exercicioRepository.findById({ _id: data.exercicio })
        if (!exercicioExiste) {
            const error = new Error('Exercício não encontrado.')
            error.statusCode = 404
            throw error
        }
        const logbookExiste = await this.logbookRepository.findOne({ exercicio: data.exercicio, sincronizado: false})
        if (logbookExiste) {
            const error = new Error('LogBook para este exercício já existe, sincronize ou apague para criar um novo.')
            error.statusCode = 400
            throw error
        }
        const logbookFormatado = {
            exercicio: data.exercicio,
            nome: exercicioExiste.nome,
            carga: data.carga,
            repeticoes: data.repeticoes,
            data: new Date()
        }
        return await this.logbookRepository.create(logbookFormatado)
    }
}
