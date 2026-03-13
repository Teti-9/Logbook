export default class logbookRepository {
    constructor(logbookModel, logerrosModel) {
        this.logbookModel = logbookModel
        this.logerrosModel = logerrosModel
    }

    async findAll(data) {
        return await this.logbookModel.find(data).populate('exercicio', ['_id', 'carga_anterior', 'repeticoes_anteriores'])
    }

    async findAll_errors(filter) {
        return await this.logerrosModel.find(filter)
    }

    async findOne(filters) {
        return await this.logbookModel.findOne(filters)
    }

    async create(body) {
        return await this.logbookModel.create(body)
    }

    async create_errors(data) {
        return await this.logerrosModel.create(data)
    }

    async deleteById(filters) {
        return await this.logbookModel.findByIdAndDelete(filters)
    }

    async deleteMany(query) {
        return await this.logbookModel.deleteMany(query)
    }
}