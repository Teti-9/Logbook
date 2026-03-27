import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { generateRefreshToken, hashRefreshToken } from '../utils/token.js'

const ACCESS_TOKEN_TTL  = '15m'
const REFRESH_TOKEN_DAYS = 30

export default class UsuarioService {
    constructor(usuarioRepository, refreshTokenRepository ) {
        this.usuarioRepository = usuarioRepository
        this.refreshTokenRepository = refreshTokenRepository
    }

    async createUsuario(data) {
        const senhaHashed = await bcrypt.hash(data.senha, 8)

        const user = {
            nome: data.nome,
            email: data.email,
            senha: senhaHashed
        }

        await this.usuarioRepository.create(user)

        return { message: 'Usuário criado com sucesso.' }
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

        return this._tokenPair(usuario)
    }

    async logoutUsuario(rawToken) {
        const tokenHash = hashRefreshToken(rawToken)
        const stored = await this.refreshTokenRepository.findByHash(tokenHash)

        if (!stored || stored.revoked) {
            const err = new Error('Refresh token inválido.')
            err.statusCode = 401
            throw err
        }

        await this.refreshTokenRepository.revokeByHash(tokenHash)

        return { message: 'Logout realizado com sucesso.' }
    }

    async refreshTokens(rawToken) {
        const tokenHash = hashRefreshToken(rawToken)
        const stored = await this.refreshTokenRepository.findByHash(tokenHash)

        if (!stored || stored.expiresAt < new Date()) {
            const err = new Error('Refresh token inválido ou expirado.')
            err.statusCode = 401
            throw err
        }

        if (stored.revoked) {
            await this.refreshTokenRepository.revokeAllForUser(stored.userId)
            const err = new Error('Refresh token reutilizado. Todas as sessões foram encerradas.')
            err.statusCode = 401
            throw err
        }

        const usuario = await this.usuarioRepository.findOne({ _id: stored.userId })
        
        const { tokens, newHash } = await this._tokenPair(usuario, { returnHash: true })

        await this.refreshTokenRepository.revokeByHash(tokenHash, newHash)

        return tokens
    }

    async _tokenPair(usuario, { returnHash = false } = {}) {
        const accessToken = jwt.sign(
            { 
                id: usuario._id, 
                nome: usuario.nome, 
                email: usuario.email 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: ACCESS_TOKEN_TTL 
            }
        )

        const rawRefresh = generateRefreshToken()
        const newHash = hashRefreshToken(rawRefresh)
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 86400 * 1000)

        await this.refreshTokenRepository.create({ 
            userId: usuario._id, 
            tokenHash: newHash, 
            expiresAt 
        })

        const tokens = { 
            accessToken: `Bearer ${accessToken}`, 
            refreshToken: rawRefresh 
        }
        
        return returnHash ? { tokens, newHash } : tokens
    }
}
