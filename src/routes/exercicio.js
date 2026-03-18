import express from 'express'
import validate from '../middleware/validate.js'
import exercicioSchema from '../middleware/exercicioMiddleware.js'
import idMongoSchema from '../middleware/idMongoMiddleware.js'

const exercicioRouter = (exercicioService) => {
    const router = express.Router()

    /**
     * @swagger
     * 
     * /api/v1/exercicios:
     *   get:
     *     summary: Retorna todos os exercícios.
     *     tags: [Exercício]
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
     *         description: Nenhum exercício encontrado.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/v1/exercicio/{id}:
     *   get:
     *     summary: Retorna um exercício único.
     *     tags: [Exercício]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: string
     *          description: ID do exercício.
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       200:
     *         description: Sucesso.
     *       404:
     *         description: Exercício não encontrado.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/v1/exercicio:
     *   post:
     *     summary: Cadastra um novo exercício.
     *     tags: [Exercício]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nome
     *               - series
     *               - carga_atual
     *               - repeticoes_alvo
     *               - repeticoes_atuais
     *               - divisao
     *             properties:
     *               nome:
     *                 type: string
     *                 example: "Supino Reto"
     *               series:
     *                 type: integer
     *                 format: int32
     *                 example: 2
     *               carga_atual:
     *                 type: number
     *                 example: 30
     *               repeticoes_alvo:
     *                 type: integer
     *                 format: int32
     *                 example: 10
     *               repeticoes_atuais:
     *                 type: number
     *                 example: 8
     *               divisao:
     *                 type: string
     *                 description: ObjectId da divisao.
     *                 example: "699a18f7c9a487fe833a6984"
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
     *       201:
     *         description: Sucesso.
     *       404:
     *         description: Divisão não encontrada.
     *       422:
     *         description: Um ou mais IDs inválidos ou erro no middleware.
     *       500:
     *         description: Erro interno do servidor.
     * 
     * /api/v1/deletar_exercicio/{id}:
     *   delete:
     *     summary: Deleta um exercício.
     *     tags: [Exercício]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: string
     *          description: ObjectId do exercício a ser deletado.
     *     responses:
     *       401:
     *         description: Token não especificado.
     *       403:
     *         description: Token inválido ou expirado.
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

        const resultado = await exercicioService.getExercicios(req.dados)

        return res.status(200).json({
            success: true,
            data: resultado
        })

    })

    router.get('/exercicio/:id', validate(idMongoSchema, 'params'), async (req, res) => { 

        const { id } = req.params

        const resultado = await exercicioService.getExercicioById(id, req.dados)

        return res.status(200).json({
            success: true,
            data: resultado
        })

    })

    router.post('/exercicio', validate(exercicioSchema, 'body'), async (req, res) => {

        const exercicioCriado = await exercicioService.createExercicio(req.body, req.dados)

        return res.status(201).json({
            success: true,
            data: exercicioCriado
        })
        
    })

    router.delete('/deletar_exercicio/:id', validate(idMongoSchema, 'params'), async (req, res) => {

        const { id } = req.params

        const exercicioDeletado = await exercicioService.deleteExercicio(id, req.dados)
        
        return res.status(200).json({
            success: true,
            data: exercicioDeletado
        })

    })

    return router
}

export default exercicioRouter
