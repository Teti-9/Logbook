export default class UserRepo {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findUser(where) {
        return this.prisma.user.findFirst({
            where
        })
    }

    async create(data) {
        return this.prisma.user.create({ data })
    }

}
