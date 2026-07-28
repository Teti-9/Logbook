import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const ExercisesRouter = (exercisesService) => {
    const router = express.Router()

    /**
 * @swagger
 * 
 * /api/exercises:
 *   get:
 *     summary: Return all exercises.
 *     tags: [Exercise]
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
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: No exercises found.
 *       500:
 *         description: There was an internal server error.
 * 
 *   post:
 *     summary: Create a new exercise.
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - series
 *               - topset_weight
 *               - topset_reps
 *               - backoff_weight
 *               - backoff_reps
 *               - divisionId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bench Press
 *               series:
 *                 type: integer
 *                 example: 3
 *               topset_weight:
 *                 type: number
 *                 example: 100
 *               topset_reps:
 *                 type: integer
 *                 example: 8
 *               backoff_weight:
 *                 type: number
 *                 minimum: 0
 *                 example: 90
 *               backoff_reps:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *               divisionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Exercise successfully created.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: Division not found.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/exercises/{id}:
 *   get:
 *     summary: Return a single exercise.
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID.
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: Exercise not found.
 *       500:
 *         description: There was an internal server error.
 * 
 *   delete:
 *     summary: Soft-delete an exercise.
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID to be deleted.
 *     responses:
 *       200:
 *         description: Exercise successfully deleted.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: Exercise not found.
 *       500:
 *         description: There was an internal server error.
 */

    router.get('/exercises', async (req, res) => {

        const { page, limit } = req.query

        const result = await exercisesService.getExercises(req.user.id, { page, limit })

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/exercises/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const result = await exercisesService.getExerciseById(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.post('/exercises', async (req, res) => {

        const fieldConfig = {
            name: "string",
            series: "number",
            topset_weight: "number",
            topset_reps: "number",
            backoff_weight: "number0",
            backoff_reps: "number0",
            divisionId: "number",
        }

        const result = validateFields(req.body, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const exerciseCreated = await exercisesService.createExercise(req.user.id, req.body)

        return res.status(201).json({
            success: true,
            data: exerciseCreated
        })

    })

    router.delete('/exercises/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const exerciseDeleted = await exercisesService.deleteExercise(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: exerciseDeleted
        })

    })

    return router
}

export default ExercisesRouter
