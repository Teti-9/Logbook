export default class DivisionService {
    constructor(divisionRepo) {
        this.divisionRepo = divisionRepo
    }

    async getDivisions() {

        const divisions = await this.divisionRepo.findAll({
            isDeleted: false
        })

        if (!divisions || divisions.length === 0) {
            const error = new Error('No division found.')
            error.statusCode = 404
            throw error
        }

        return divisions
    }

    async getDivisionById(id) {
        const divisionId = Number(id)

        const division = await this.divisionRepo.findById({
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

    async createDivision(body) {

        const lowercaseDay = body.day.toLowerCase()

        const dayUsed = await this.divisionRepo.findOne({
            day: lowercaseDay,
            isDeleted: false
        })

        if (dayUsed) {
            const error = new Error('A training split for this day already exists.')
            error.statusCode = 400
            throw error
        }

        const newData = {
            ...body
        }

        await this.divisionRepo.create(newData)

        return { message: 'Training split successfully created.' }
    }

    async deleteDivision(id) {
        const divisionId = Number(id)

        const divisionExists = await this.divisionRepo.findById({
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
