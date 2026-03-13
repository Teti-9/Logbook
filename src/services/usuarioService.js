import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository
    }

    async createUsuario(data) {
        const senhaHashed = await bcrypt.hash(data.senha, 8)

        const user = {
            nome: data.nome,
            email: data.email,
            senha: senhaHashed
        }
        return await this.usuarioRepository.create(user)
    }

    async loginUsuario(email, senha) {
        const usuario = await this.usuarioRepository.findOne({
            email: email
        })

        if (!usuario) {
            const error = new Error('Email não encontrado.')
            error.statusCode = 404
            throw error
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        
        if (!senhaValida) {
            const error = new Error('Senha inválida.')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({
            id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
        },
            process.env.JWT_SECRET, { expiresIn: '12h' })

        return `Bearer ${token}`
    }

}
