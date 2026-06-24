export default class ExercisesRepo {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findAll(where) {
        return this.prisma.exercises.findMany({
            where
        })
    }

    async findById(where) {
        return this.prisma.exercises.findFirst({
            where
        })
    }

    async findOne(where) {
        return this.prisma.exercises.findFirst({
            where
        })
    }

    async create(data) {
        return this.prisma.exercises.create({ data })
    }

    async findByIdAndUpdate(id, data) {
        return this.prisma.exercises.update({ where: { id }, data })
    }

    async findByIdAndDelete(id) {
        return this.prisma.exercises.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
    }
}
