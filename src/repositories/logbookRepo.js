export default class LogbookRepo {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findAll(where) {
        return this.prisma.logbook.findMany({
            where,
            include: {
                exercise: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        })
    }

    async findById(where) {
        return this.prisma.logbook.findFirst({
            where
        })
    }

    async findOne(where) {
        return this.prisma.logbook.findFirst({
            where
        })
    }

    async create(data) {
        return this.prisma.logbook.create({ data })
    }

    async findByIdAndUpdate(id, data) {
        return this.prisma.logbook.update({ where: { id }, data })
    }

    async findByIdAndDelete(id) {
        return this.prisma.logbook.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
    }
}
