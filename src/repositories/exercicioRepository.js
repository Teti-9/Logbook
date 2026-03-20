export default class DivisaoRepository {
    constructor(exercicioModel) {
        this.exercicioModel = exercicioModel
    }

    async findAll(data, { page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit
    
        const [exercicios, total] = await Promise.all([
            this.exercicioModel
                .find(data)
                .sort({ createdAt: -1, _id: -1 })
                .populate('divisao', ['nome', 'dia'])
                .skip(skip)
                .limit(limit)
                .lean(),
            this.exercicioModel.countDocuments(data)
        ])
    
        return { exercicios, total }
    }

    async findById(filters) {
        return await this.exercicioModel.findOne(filters).populate('divisao', ['nome', 'dia'])
    }

    async findByIdAndUpdate(id, property, options, data) {
        return await this.exercicioModel.findByIdAndUpdate(id, property, options, data)
    }

    async findOne(filter) {
        return await this.exercicioModel.findOne(filter)
    }

    async create(body) {
        return await this.exercicioModel.create(body)
    }
}