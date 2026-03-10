import express from 'express'
import validate from '../middleware/validate.js'
import logbookSchema from '../middleware/logbookMiddleware.js'
import sinclogbookSchema from '../middleware/sinclogbookMiddleware.js'

const logbookRouter = (logbookService) => {
    const router = express.Router()

    /**
     * @swagger
     * 
     * /api/logerros:
     *   get:
     *     summary: Retorna todos os erros de sincronização dos logbooks.
     *     tags: [Logbook]
     *     responses:
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Nenhum erro encontrado.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/logbooks:
     *   get:
     *     summary: Retorna todos os logbooks.
     *     tags: [Logbook]
     *     responses:
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Nenhum logbook encontrado.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/sinclogbook:
     *   post:
     *     summary: Sincroniza um ou mais logbook(s).
     *     tags: [Logbook]
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
     *       200:
     *         description: Sucesso.
     *       400:
     *         description: Falhas na sincronização.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/logbook:
     *   post:
     *     summary: Cadastra um novo logbook.
     *     tags: [Logbook]
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

    router.get("/logerros", async (req, res) => {

        try {
            const resultado = await logbookService.getLogerros()
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

    router.get("/logbooks", async (req, res) => {

        try {
            const resultado = await logbookService.getLogbooks()
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

    router.post('/sinclogbook', validate(sinclogbookSchema, 'body'), async (req, res) => {

        try {
            const sincronizado = await logbookService.sincLogbook(req.body)
            return res.status(200).json({
                success: true,
                data: sincronizado
            })
        } catch (erro) {
            return res.status(erro.statusCode || 500).json({
                success: false,
                data: erro.data || erro.message
            })
        }
    })

    router.post('/logbook', validate(logbookSchema, 'body'), async (req, res) => {

        try {
            const logbookCriado = await logbookService.createLogbook(req.body)
            return res.status(201).json({
                success: true,
                data: logbookCriado
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

export default logbookRouter