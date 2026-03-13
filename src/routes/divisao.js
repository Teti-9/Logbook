import express from 'express'
import validate from '../middleware/validate.js'
import divisaoSchema from '../middleware/divisaoMiddleware.js'
import idMongoSchema from '../middleware/idMongoMiddleware.js'

const divisaoRouter = (divisaoService) => {
    const router = express.Router()

    /**
     * @swagger
     * 
     * /api/divisoes:
     *   get:
     *     summary: Retorna todas as divisões.
     *     tags: [Divisão]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Nenhuma divisão encontrada.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/divisao/{id}:
     *   get:
     *     summary: Retorna uma divisão única.
     *     tags: [Divisão]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: string
     *          description: ID da divisão.
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Divisão não encontrada.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/divisao:
     *   post:
     *     summary: Cadastra uma nova divisão.
     *     tags: [Divisão]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *                 example: "Push 1, Pull 1, etc..."
     *               dia:
     *                 type: string
     *                 example: "Segunda, Terça, Quarta..."
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       201:
     *         description: Sucesso.
     *       400:
     *         description: Já existe uma divisão para esse dia.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/deletar_divisao/{id}:
     *   delete:
     *     summary: Deleta uma divisão.
     *     tags: [Divisão]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: string
     *          description: ID da divisão a ser deletada.
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       200:
     *         description: Sucesso.
     *       400:
     *         description: Não é possível excluir uma divisão com exercícios associados.
     *       404:
     *         description: Divisão não encontrada.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     */

    router.get('/divisoes', async (req, res) => {

        try {

            const resultado = await divisaoService.getDivisoes(req.dados)
            return res.status(200).json({
                success: true,
                data: resultado
            })

        } catch (erro) {
            return res.status(erro.statusCode || 500).json({
                success: false,
                data: erro.message
            })
        }
    })

    router.get('/divisao/:id', validate(idMongoSchema, 'params'), async (req, res) => {

        try {

            const { id } = req.params
            const resultado = await divisaoService.getDivisaoById(id, req.dados)
            return res.status(200).json({
                success: true,
                data: resultado
            })

        } catch (erro) {
            return res.status(erro.statusCode || 500).json({
                success: false,
                data: erro.message
            })
        }
    })

    router.post('/divisao', validate(divisaoSchema, 'body'), async (req, res) => {

        try {

            const divisaoCriada = await divisaoService.createDivisao(req.body, req.dados)
            return res.status(201).json({
                success: true,
                data: divisaoCriada
            })

        } catch (erro) {
            return res.status(erro.statusCode || 500).json({
                success: false,
                data: erro.message
            })
        }
    })

    router.delete('/deletar_divisao/:id', validate(idMongoSchema, 'params'), async (req, res) => {

        try {

            const { id } = req.params
            await divisaoService.deleteDivisao(id, req.dados)
            return res.status(200).json({
                success: true,
                data: "Divisão excluída com sucesso."
            })
            
        } catch (erro) {
            return res.status(erro.statusCode || 500).json({
                success: false,
                data: erro.message
            })
        }
    })

    return router
}

export default divisaoRouter
