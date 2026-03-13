export default class UsuarioRepository {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel
    }
    
    async findOne(filter) {
        return await this.usuarioModel.findOne(filter)
    }

    async create(data) {
        return await this.usuarioModel.create(data)
    }

}