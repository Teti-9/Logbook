export default class DivisionService {
    constructor(divisionRepo) {
        this.divisionRepo = divisionRepo
    }

    async getDivisions(userId, { page = 1, limit = 10 } = {}) {

        const { divisions, total } = await this.divisionRepo.findAll({
            userId: userId,
            isDeleted: false
        }, {
            page,
            limit
        }
        )

        if (!divisions || divisions.length === 0) {
            const error = new Error('No divisions found.')
            error.statusCode = 404
            throw error
        }

        return {
            divisions,
            pagination: {
                total,
                page: Number(page || 1),
                limit: Number(limit || 10),
                totalPages: Math.ceil(total / (Number(limit) || 10))
            }
        }
    }

    async getDivisionById(userId, id) {
        const divisionId = Number(id)

        const division = await this.divisionRepo.findById({
            userId: userId,
            id: divisionId,
            isDeleted: false
        })

        if (!division) {
            const error = new Error('Division not found.')
            error.statusCode = 404
            throw error
        }

        return division
    }

    async createDivision(userId, body) {

        const lowercaseName = body.name.toLowerCase()
        const lowercaseDay = body.day.toLowerCase()

        const dayUsed = await this.divisionRepo.findOne({
            userId: userId,
            day: lowercaseDay,
            isDeleted: false
        })

        if (dayUsed) {
            const error = new Error('A training split for this day already exists.')
            error.statusCode = 400
            throw error
        }

        const newData = {
            name: lowercaseName,
            day: lowercaseDay,
            userId: userId
        }

        await this.divisionRepo.create(newData)

        return { message: 'Training split successfully created.' }
    }

    async deleteDivision(userId, id) {
        const divisionId = Number(id)

        const divisionExists = await this.divisionRepo.findById({
            userId: userId,
            id: divisionId,
            isDeleted: false
        })

        if (!divisionExists) {
            const error = new Error('Division not found.')
            error.statusCode = 404
            throw error
        }

        await this.divisionRepo.findByIdAndDelete(divisionId)

        return { message: 'Division successfully deleted.' }
    }
}
