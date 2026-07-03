export default class RefreshTokenRepo {
    constructor(prisma) {
        this.prisma = prisma
    }

    async findByHash(where) {
        return this.prisma.refreshToken.findFirst({
            where
        })
    }

    async create(data) {
        return this.prisma.refreshToken.create({ data })
    }

    async revokeByHash(tokenHash, replacedBy = null) {
        return this.prisma.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true, replacedBy } })
    }

    async revokeUser(userId) {
        return this.prisma.refreshToken.updateMany({
            where: { userId },
            data: {
                revoked: true
            }
        })
    }
}
