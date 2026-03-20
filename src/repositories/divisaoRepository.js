export default class DivisaoRepository {
    constructor(divisaoModel) {
        this.divisaoModel = divisaoModel
    }

    async findAll(data, { page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit
    
        const [divisoes, total] = await Promise.all([
            this.divisaoModel
                .find(data)
                .sort({ createdAt: -1, _id: -1 })
                .populate('exercicios', ['_id', 'nome'])
                .skip(skip)
                .limit(limit)
                .lean(),
            this.divisaoModel.countDocuments(data)
        ])
    
        return { divisoes, total }
    }

    async findById(filters) {
        return await this.divisaoModel.findOne(filters).populate('exercicios', ['_id', 'nome'])
    }

    async findByIdAndUpdate(id, property, options, data) {
        return await this.divisaoModel.findByIdAndUpdate(id, property, options, data)
    }

    async findOne(filters) {
        return await this.divisaoModel.findOne(filters)
    }

    async create(body) {
        return await this.divisaoModel.create(body)
    }
}