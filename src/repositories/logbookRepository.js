export default class logbookRepository {
    constructor(logbookModel, logerrosModel) {
        this.logbookModel = logbookModel
        this.logerrosModel = logerrosModel
    }

    async findAll() {
        return await this.logbookModel.find().populate('exercicio', ['_id', 'carga_anterior', 'repeticoes_anteriores'])
    }

    async findAll_errors(filter) {
        return await this.logerrosModel.find(filter)
    }

    async findOne(filters) {
        return await this.logbookModel.findOne(filters)
    }

    async create(data) {
        return await this.logbookModel.create(data)
    }

    async create_errors(data) {
        return await this.logerrosModel.create(data)
    }
}