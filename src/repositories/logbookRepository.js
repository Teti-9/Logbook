export default class logbookRepository {
    constructor(logbookModel, logerrosModel) {
        this.logbookModel = logbookModel
        this.logerrosModel = logerrosModel
    }

    async findAll(data, { page = 1, limit = 10 } = {}   ) {
        const skip = (page - 1) * limit
    
        const [logbooks, total] = await Promise.all([
            this.logbookModel
                .find(data)
                .sort({ createdAt: -1, _id: -1 })
                .populate('exercicio', ['_id', 'carga_anterior', 'repeticoes_anteriores'])
                .skip(skip)
                .limit(limit)
                .lean(),
            this.logbookModel.countDocuments(data)
        ])
    
        return { logbooks, total }
    }

    async findAll_errors(data, { page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit
    
        const [logerros, total] = await Promise.all([
            this.logerrosModel
                .find(data)
                .sort({ createdAt: -1, _id: -1 })
                .populate('exercicio_id', ['_id', 'nome'])
                .skip(skip)
                .limit(limit)
                .lean(),
            this.logerrosModel.countDocuments(data)
        ])
    
        return { logerros, total }
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

    async deleteMany(filters) {
        return await this.logbookModel.deleteMany(filters)
    }
}