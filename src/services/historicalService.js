export default class HistoricalService {
    constructor(historicalRepo) {
        this.historicalRepo = historicalRepo
    }

    async getHistorical(userId, search) {

        const isDeleted = false

        const historical = await this.historicalRepo.findAll(userId, isDeleted, search)

        if (!historical || historical.length === 0) {
            const error = new Error('No historical archives found.')
            error.statusCode = 404
            throw error
        }

        return historical
    }

    async getHistoricalById(userId, id) {
        const historicalId = Number(id)

        const historical = await this.historicalRepo.findById({
            userId: userId,
            id: historicalId,
            isDeleted: false
        })

        if (!historical) {
            const error = new Error('Historical archive not found.')
            error.statusCode = 404
            throw error
        }

        return historical
    }

    async deleteHistorical(userId, id) {
        const historicalId = Number(id)

        const historical = await this.historicalRepo.findById({
            userId: userId,
            id: historicalId,
            isDeleted: false
        })

        if (!historical) {
            const error = new Error('Historical archive not found.')
            error.statusCode = 404
            throw error
        }

        await this.historicalRepo.findByIdAndDelete(historicalId)

        return { message: 'Historical archive successfully deleted.' }
    }
}
