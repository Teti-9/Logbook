export default class HistoricalRepo {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findAll(where) {
        return this.prisma.historical.findMany({
            where,
            include: {
                exercise: {
                    select: {
                        name: true,
                        topset_weight: true,
                        topset_reps: true,
                        backoff_weight: true,
                        backoff_reps: true,
                        updatedAt: true
                    }
                }
            },
        })
    }

    async findById(where) {
        return this.prisma.historical.findFirst({
            where
        })
    }

    async findOne(where) {
        return this.prisma.historical.findFirst({
            where
        })
    }

    async create(data) {
        return this.prisma.historical.create({ data })
    }

    async findByIdAndUpdate(id, data) {
        return this.prisma.historical.update({ where: { id }, data })
    }

    async findByIdAndDelete(id) {
        return this.prisma.historical.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
    }
}
