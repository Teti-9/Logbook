import sincLogbooks from "../utils/sinclogbooks.js"

export default class LogbookService {
    constructor(logbookRepo, exercisesRepo, historicalRepo) {
        this.logbookRepo = logbookRepo
        this.exercisesRepo = exercisesRepo
        this.historicalRepo = historicalRepo
    }

    async getLogbooks() {

        const logbooks = await this.logbookRepo.findAll({
            sinc: false,
            isDeleted: false
        })

        if (!logbooks || logbooks.length === 0) {
            const error = new Error('No logbooks found.')
            error.statusCode = 404
            throw error
        }

        return logbooks
    }

    async getLogbookById(id) {
        const logbookId = Number(id)

        const logbook = await this.logbookRepo.findById({
            id: logbookId,
            sinc: false,
            isDeleted: false
        })

        if (!logbook) {
            const error = new Error('Logbook not found.')
            error.statusCode = 404
            throw error
        }

        return logbook
    }

    async createLogbook(body) {
        const exerciseId = Number(body.exerciseId)

        const exerciseExists = await this.exercisesRepo.findById({
            id: exerciseId,
            isDeleted: false
        })

        if (!exerciseExists) {
            const error = new Error('Exercise not found.')
            error.statusCode = 404
            throw error
        }

        const logbookExists = await this.logbookRepo.findById({
            exerciseId,
            sinc: false,
            isDeleted: false,
        })

        if (logbookExists) {
            const error = new Error('A logbook for this exercise already exists and it is not synced yet.')
            error.statusCode = 404
            throw error
        }

        console.log('logbookExists:', logbookExists)

        const newData = {
            ...body
        }

        await this.logbookRepo.create(newData)

        return { message: 'Logbook successfully created.' }
    }

    async sincLogbook(body) {

        const { logbooks } = body
        const sincronizados = []

        for (const exerciseId of logbooks) {

            try {

                const sincResult = await sincLogbooks(exerciseId, this.exercisesRepo, this.logbookRepo, this.historicalRepo)
                sincronizados.push(sincResult)

            } catch (error) {

                throw new Error(error)

            }
        }

        return {
            message: sincronizados
        }
    }

    async deleteLogbook(id) {
        const logbookId = Number(id)

        const logbook = await this.logbookRepo.findById({
            id: logbookId,
            isDeleted: false
        })

        if (!logbook) {
            const error = new Error('Logbook not found.')
            error.statusCode = 404
            throw error
        }

        await this.logbookRepo.findByIdAndDelete(logbookId)

        return { message: 'Logbook successfully deleted.' }
    }
}
