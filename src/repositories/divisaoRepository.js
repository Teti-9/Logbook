export default class DivisaoRepository {
    constructor(divisaoModel) {
        this.divisaoModel = divisaoModel
    }

    async findAll() {
        return await this.divisaoModel.find().populate('exercicios', ['_id', 'nome'])
    }

    async findById(id) {
        return await this.divisaoModel.findById(id).populate('exercicios', ['_id', 'nome'])
    }

    async findByIdAndUpdate(id, data, options) {
        return await this.divisaoModel.findByIdAndUpdate(id, data, options)
    }

    async findOne(filter) {
        return await this.divisaoModel.findOne(filter)
    }

    async create(data) {
        return await this.divisaoModel.create(data)
    }

    async deleteById(id) {
        return await this.divisaoModel.findByIdAndDelete({ _id: id })
    }
}