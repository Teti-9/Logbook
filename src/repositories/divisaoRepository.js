export default class DivisaoRepository {
    constructor(divisaoModel) {
        this.divisaoModel = divisaoModel
    }

    async findAll(data) {
        return await this.divisaoModel.find(data).populate('exercicios', ['_id', 'nome'])
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

    async deleteById(filters) {
        return await this.divisaoModel.findByIdAndDelete(filters)
    }
}