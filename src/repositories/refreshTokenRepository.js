export default class RefreshTokenRepository {
    constructor(refreshTokenModel) {
        this.model = refreshTokenModel
    }

    async create(data) {
        return this.model.create(data) 
    }

    async findByHash(tokenHash) { 
        return this.model.findOne({ tokenHash }) 
    }

    async revokeByHash(tokenHash, replacedBy = null) {
        return this.model.updateOne({ tokenHash }, { revoked: true, replacedBy })
    }

    async revokeAllForUser(userId) {
        return this.model.updateMany({ userId }, { revoked: true }) 
    }
}