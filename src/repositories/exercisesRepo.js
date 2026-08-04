export default class ExercisesRepo {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findAll({ userId, isDeleted }, { page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit

        const [exercises, total] = await Promise.all([
            this.prisma.exercises.findMany({
                where: {
                    userId,
                    isDeleted
                },
                include: {
                    logbook: {
                        where: {
                            sinc: false,
                            isDeleted: false,
                        },
                        select: {
                            id: true
                        }
                    }
                },
                orderBy: {
                    id: 'asc'
                },
                skip,
                take: Number(limit)
            }),
            this.prisma.exercises.count({ where: { userId, isDeleted } })
        ])

        return { exercises, total }
    }

    async findById(where) {
        return this.prisma.exercises.findFirst({
            where,
            include: {
                logbook: {
                    where: {
                        sinc: false,
                        isDeleted: false,
                    },
                    select: {
                        id: true
                    }
                }
            },
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
