import sincLogbooks from "../utils/sinclogbooks.js"

export default class LogbookService {
    constructor(logbookRepo, exercisesRepo, prisma) {
        this.logbookRepo = logbookRepo
        this.exercisesRepo = exercisesRepo
        this.prisma = prisma
    }

    async getLogbooks(userId) {

        const logbooks = await this.logbookRepo.findAll({
            userId: userId,
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

    async getLogbookById(userId, id) {
        const logbookId = Number(id)

        const logbook = await this.logbookRepo.findById({
            userId: userId,
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

    async createLogbook(userId, body) {
        const exerciseId = Number(body.exerciseId)

        const exerciseExists = await this.exercisesRepo.findById({
            userId: userId,
            id: exerciseId,
            isDeleted: false
        })

        if (!exerciseExists) {
            const error = new Error('Exercise not found.')
            error.statusCode = 404
            throw error
        }

        const logbookExists = await this.logbookRepo.findById({
            userId: userId,
            exerciseId,
            sinc: false,
            isDeleted: false,
        })

        if (logbookExists) {
            const error = new Error('A logbook for this exercise already exists and it is not yet synced.')
            error.statusCode = 404
            throw error
        }

        const newData = {
            ...body,
            userId: userId
        }

        await this.logbookRepo.create(newData)

        return { message: 'Logbook successfully created.' }
    }

    async sincLogbook(userId, body) {

        const { logbooks } = body
        const sincronizados = []

        for (const exerciseId of logbooks) {

            try {

                const sincResult = await sincLogbooks(userId, exerciseId, this.prisma)
                sincronizados.push(sincResult)

            } catch (error) {

                throw new Error(error)

            }
        }

        return {
            message: sincronizados
        }
    }

    async deleteLogbook(userId, id) {
        const logbookId = Number(id)

        const logbook = await this.logbookRepo.findById({
            userId: userId,
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
