export default class DivisaoRepository {
    constructor(exercicioModel) {
        this.exercicioModel = exercicioModel
    }

    async findAll() {
        return await this.exercicioModel.find().populate('divisao', ['nome', 'dia'])
    }

    async findById(id) {
        return await this.exercicioModel.findById(id).populate('divisao', ['nome', 'dia'])
    }

    async findOne(filter) {
        return await this.exercicioModel.findOne(filter)
    }

    async create(data) {
        return await this.exercicioModel.create(data)
    }

    async deleteById(id) {
        return await this.exercicioModel.findByIdAndDelete({ _id: id })
    }
}