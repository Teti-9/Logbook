import express from 'express'
import validate from '../middleware/validate.js'
import usuarioSchema from '../middleware/usuarioValidationMiddleware.js'
import loginSchema from '../middleware/loginValidationMiddleware.js'

const usuarioRouter = (usuarioService) => {
    const router = express.Router()

    /**
     * @swagger
     * /api/registrar:
     *   post:
     *     summary: Registra o usuário
     *     tags: [Autenticação]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário registrado com sucesso.
     *       401:
     *         description: Email já cadastrado.
     *       422:
     *         description: Erro validação middleware.
     *       500:
     *         description: Erro interno do servidor.
     * /api/logar:
     *   post:
     *     summary: Faz login do usuário
     *     tags: [Autenticação]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login bem-sucedido.
     *       401:
     *         description: Senha inválida.
     *       404:
     *         description: Email não encontrado.
     *       422:
     *         description: Erro validação middleware.
     *       500:
     *         description: Erro interno do servidor.
     */

    router.post('/registrar', validate(usuarioSchema, 'body'), async (req, res) => {

        const usuarioCriado = await usuarioService.createUsuario(req.body)

        return res.status(201).json({
            success: true,
            data: "Usuário registrado com sucesso."
        })
        
    })

    router.post('/logar', validate(loginSchema, 'body'), async (req, res) => {

        const { email, senha } = req.body

        const logar = await usuarioService.loginUsuario(email, senha)

        return res.status(200).json({
            success: true,
            data: logar
        })

    })

    return router
}

export default usuarioRouter