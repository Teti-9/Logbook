export default class DivisionRepo {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findAll(where) {
        return this.prisma.division.findMany({
            where
        })
    }

    async findById(where) {
        return this.prisma.division.findFirst({
            where
        })
    }

    async findOne(where) {
        return this.prisma.division.findFirst({
            where
        })
    }

    async create(data) {
        return this.prisma.division.create({ data })
    }

    async findByIdAndUpdate(id, data) {
        return this.prisma.division.update({ where: { id }, data })
    }

    async findByIdAndDelete(id) {
        return this.prisma.division.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
    }
}
