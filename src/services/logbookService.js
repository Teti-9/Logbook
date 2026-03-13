import sincronizarExercicioComLogBook from '../utils/sincronizarExercicioComLogBook.js'

export default class LogbookService {
    constructor(logbookRepository, exercicioRepository) {
        this.logbookRepository = logbookRepository
        this.exercicioRepository = exercicioRepository
    }

    async getLogerros(data) {

        const logerros = await this.logbookRepository.findAll_errors({ 
            resolvido: false,
            userId: data.userId 
        })

        if (!logerros || logerros.length === 0) {
            const error = new Error("Nenhum erro encontrado.")
            error.statusCode = 404
            throw error
        }

        return logerros
    }

    async getLogbooks(data) {

        const logbooks = await this.logbookRepository.findAll({
            userId: data.userId
        })
        
        if (!logbooks || logbooks.length === 0) {
            const error = new Error("Nenhum logbook encontrado.")
            error.statusCode = 404
            throw error
        }

        return logbooks
    }

    async sincLogbook(body, data) {

        const { exercicios } = body

        const sincronizados = []
        const falhas = []
        const ERROS_SEM_LOG = [
            'Exercício não encontrado.',
            'Logbook não encontrado para este exercício.'
        ]

        for (const exercicioId of exercicios) {

            try {

                const sincResultado = await sincronizarExercicioComLogBook(exercicioId, data.userId )
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

    async createLogbook(body, data) {

        const exercicioExiste = await this.exercicioRepository.findById({ 
            _id: body.exercicio, 
            userId: data.userId})

        if (!exercicioExiste) {
            const error = new Error('Exercício não encontrado.')
            error.statusCode = 404
            throw error
        }

        const logbookExiste = await this.logbookRepository.findOne({ 
            exercicio: body.exercicio, 
            sincronizado: false, 
            userId: data.userId
        })

        if (logbookExiste) {
            const error = new Error('LogBook para este exercício já existe, sincronize ou apague para criar um novo.')
            error.statusCode = 400
            throw error
        }

        const logbookFormatado = {
            exercicio: body.exercicio,
            nome: exercicioExiste.nome,
            carga: body.carga,
            repeticoes: body.repeticoes,
            data: new Date(),
            userId: data.userId
        }

        return await this.logbookRepository.create(logbookFormatado)
    }
}
