import express from 'express'
import validate from '../middleware/validate.js'
import exercicioSchema from '../middleware/exercicioMiddleware.js'
import idMongoSchema from '../middleware/idMongoMiddleware.js'

const exercicioRouter = (exercicioService) => {
    const router = express.Router()

    /**
     * @swagger
     * 
     * /api/exercicios:
     *   get:
     *     summary: Retorna todos os exercícios.
     *     tags: [Exercício]
     *     responses:
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Nenhum exercício encontrado.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/exercicio/{id}:
     *   get:
     *     summary: Retorna um exercício único.
     *     tags: [Exercício]
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: string
     *          description: ID do exercício.
     *     responses:
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Exercício não encontrado.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/exercicio:
     *   post:
     *     summary: Cadastra um novo exercício.
     *     tags: [Exercício]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *                 example: "Supino Reto"
     *               series:
     *                 type: int
     *                 example: 2
     *               repeticoes_alvo:
     *                 type: int
     *                 example: 10
     *               carga_atual:
     *                 type: int
     *                 example: 30
     *               repeticoes_atuais:
     *                 type: int
     *                 example: 8
     *               divisao (mongodb _id):
     *                 type: string
     *                 example: "699a18f7c9a487fe833a6984"
     *     responses:
     *       201:
     *         description: Sucesso.
     *       404:
     *         description: Divisão não encontrada.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/deletar_exercicio/{id}:
     *   delete:
     *     summary: Deleta um exercício.
     *     tags: [Exercício]
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: integer
     *          description: ID do exercício a ser deletado.
     *     responses:
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Exercício não encontrado.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     */

    router.get('/exercicios', async (req, res) => {
        try {
            const resultado = await exercicioService.getExercicios()
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

    router.get('/exercicio/:id', validate(idMongoSchema, 'params'), async (req, res) => { 
        try {
            const { id } = req.params
            const resultado = await exercicioService.getExercicioById(id)
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

    router.post('/exercicio', validate(exercicioSchema, 'body'), async (req, res) => {
        try {
            const exercicioCriado = await exercicioService.createExercicio(req.body)
            return res.status(201).json({
                success: true,
                data: exercicioCriado
            })
        } catch (erro) {
            return res.status(erro.statusCode || 500).json({
                success: false,
                data: erro.message
            })
        }
    })

    router.delete('/deletar_exercicio/:id', validate(idMongoSchema, 'params'), async (req, res) => {

        try {
            const { id } = req.params
            await exercicioService.deleteExercicio(id)
            return res.status(200).json({
                success: true,
                data: "Exercício excluído com sucesso."
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

export default exercicioRouter