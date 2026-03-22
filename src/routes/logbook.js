import express from 'express'
import validate from '../middleware/validate.js'
import logbookSchema from '../middleware/logbookMiddleware.js'
import sinclogbookSchema from '../middleware/sinclogbookMiddleware.js'
import paramsSchema from '../middleware/paramsMiddleware.js'

const logbookRouter = (logbookService) => {
    const router = express.Router()

    /**
     * @swagger
     * 
     * /api/v1/logerros:
     *   get:
     *     summary: Retorna todos os erros de sincronização dos logbooks.
     *     tags: [Logbook]
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
     *         description: Nenhum erro encontrado.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/v1/logbooks:
     *   get:
     *     summary: Retorna todos os logbooks.
     *     tags: [Logbook]
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
     *         description: Nenhum logbook encontrado.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/v1/sinclogbook:
     *   post:
     *     summary: Sincroniza um ou mais logbook(s).
     *     tags: [Logbook]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - exercicios
     *             properties:
     *               exercicios:
     *                 type: array
     *                 items:
     *                   type: string
     *                 example: ["699a18f7c9a487fe833a6984"]
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       200:
     *         description: Sucesso.
     *       400:
     *         description: Falhas na sincronização.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/v1/logbook:
     *   post:
     *     summary: Cadastra um novo logbook.
     *     tags: [Logbook]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - carga
     *               - repeticoes
     *               - exercicio
     *             properties:
     *               carga:
     *                 type: number
     *                 example: 25
     *               repeticoes:
     *                 type: number
     *                 example: 10
     *               exercicio:
     *                 type: string
     *                 description: ObjectId do exercicio.
     *                 example: "699a18f7c9a487fe833a6984"
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       201:
     *         description: Sucesso.
     *       404:
     *         description: Exercício não encontrado.
     *       400:
     *         description: LogBook para este exercício já existe, sincronize ou apague para criar um novo.
     *       422:
     *         description: ID do exercício inválido ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.

     */

    router.get("/logerros", validate(paramsSchema, 'query'), async (req, res) => {
        
        const { page, limit } = req.query

        const resultado = await logbookService.getLogerros(req.dados, { 
            page, 
            limit
        })
        
        return res.status(200).json({
            success: true,
            data: resultado
        })

    })

    router.get("/logbooks", validate(paramsSchema, 'query'), async (req, res) => {

        const { page, limit } = req.query
        
        const resultado = await logbookService.getLogbooks(req.dados, { 
            page, 
            limit
        })

        return res.status(200).json({
            success: true,
            data: resultado
        })

    })

    router.post('/sinclogbook', validate(sinclogbookSchema, 'body'), async (req, res) => {

        const sincronizado = await logbookService.sincLogbook(req.body, req.dados)

        return res.status(200).json({
            success: true,
            data: sincronizado
        })

    })

    router.post('/logbook', validate(logbookSchema, 'body'), async (req, res) => {
        
        const logbookCriado = await logbookService.createLogbook(req.body, req.dados)

        return res.status(201).json({
            success: true,
            data: logbookCriado
        })

    })

    return router 
}

export default logbookRouter
