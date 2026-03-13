export default class DivisaoRepository {
    constructor(exercicioModel) {
        this.exercicioModel = exercicioModel
    }

    async findAll(data) {
        return await this.exercicioModel.find(data).populate('divisao', ['nome', 'dia'])
    }

    async findById(filters) {
        return await this.exercicioModel.findOne(filters).populate('divisao', ['nome', 'dia'])
    }

    async findOne(filter) {
        return await this.exercicioModel.findOne(filter)
    }

    async create(body) {
        return await this.exercicioModel.create(body)
    }

    async deleteById(filters) {
        return await this.exercicioModel.findByIdAndDelete(filters)
    }
}