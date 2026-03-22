import express from 'express'
import validate from '../middleware/validate.js'
import divisaoSchema from '../middleware/divisaoMiddleware.js'
import idMongoSchema from '../middleware/idMongoMiddleware.js'
import paramsSchema from '../middleware/paramsMiddleware.js'

const divisaoRouter = (divisaoService) => {
    const router = express.Router()

    /**
     * @swagger
     * 
     * /api/v1/divisoes:
     *   get:
     *     summary: Retorna divisões ativas com paginação.
     *     tags: [Divisão]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Página da listagem.
     *       - in: query
     *         name: limit
     *         required: false
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 10
     *         description: Quantidade de itens por página.
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
     * /api/v1/divisao/{id}:
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
     * /api/v1/divisao:
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
     * /api/v1/deletar_divisao/{id}:
     *   delete:
     *     summary: Realiza soft delete de uma divisão.
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
     *         description: Divisão marcada como excluída (soft delete).
     *       400:
     *         description: Não é possível excluir uma divisão com exercícios associados.
     *       404:
     *         description: Divisão não encontrada.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     */

    router.get('/divisoes', validate(paramsSchema, 'query'), async (req, res) => {

        const { page, limit } = req.query

        const resultado = await divisaoService.getDivisoes(req.dados, { 
            page, 
            limit
        })

        return res.status(200).json({
            success: true,
            data: resultado
        })

    })

    router.get('/divisao/:id', validate(idMongoSchema, 'params'), async (req, res) => {

        const { id } = req.params

        const resultado = await divisaoService.getDivisaoById(id, req.dados)

        return res.status(200).json({
            success: true,
            data: resultado
        })

    })

    router.post('/divisao', validate(divisaoSchema, 'body'), async (req, res) => {

        const divisaoCriada = await divisaoService.createDivisao(req.body, req.dados)

        return res.status(201).json({
            success: true,
            data: divisaoCriada
        })

    })

    router.delete('/deletar_divisao/:id', validate(idMongoSchema, 'params'), async (req, res) => {

        const { id } = req.params

        const divisaoExcluida = await divisaoService.deleteDivisao(id, req.dados)
        
        return res.status(200).json({
            success: true,
            data: divisaoExcluida
        })
            
    })

    return router
}

export default divisaoRouter
