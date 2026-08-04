import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const LogbookRouter = (logbookService) => {
    const router = express.Router()

    /**
 * @swagger
 * 
 * /api/logbooks:
 *   get:
 *     summary: Return all logbooks.
 *     tags: [Logbook]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: No logbooks found.
 *       500:
 *         description: There was an internal server error.
 * 
 *   post:
 *     summary: Create a new logbook entry.
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
 *               - exerciseId
 *               - topset_weight
 *               - topset_reps
 *             properties:
 *               exerciseId:
 *                 type: integer
 *                 example: 1
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
 *     responses:
 *       201:
 *         description: Logbook successfully created.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: Exercise not found.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/sinclogbooks:
 *   post:
 *     summary: Synchronize one or more logbooks.
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
 *               - logbooks
 *             properties:
 *               logbooks:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Logbooks successfully synchronized.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/logbooks/{id}:
 *   get:
 *     summary: Return a single logbook.
 *     tags: [Logbook]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Logbook ID.
 *     responses:
 *       200:
 *         description: Success.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: Logbook not found.
 *       500:
 *         description: There was an internal server error.
 * 
 *   delete:
 *     summary: Soft-delete a logbook.
 *     tags: [Logbook]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Logbook ID to be deleted.
 *     responses:
 *       200:
 *         description: Logbook successfully deleted.
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       404:
 *         description: Logbook not found.
 *       500:
 *         description: There was an internal server error.
 */

    router.get('/logbooks', async (req, res) => {

        const result = await logbookService.getLogbooks(req.user.id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/logbooks/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const result = await logbookService.getLogbookById(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.post('/logbooks', async (req, res) => {

        const fieldConfig = {
            exerciseId: "number",
            topset_weight: "number",
            topset_reps: "number",
            backoff_weight: "number0",
            backoff_reps: "number0",
        }

        const result = validateFields(req.body, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const logbookCreated = await logbookService.createLogbook(req.user.id, req.body)

        return res.status(201).json({
            success: true,
            data: logbookCreated
        })

    })

    router.post('/sinclogbooks', async (req, res) => {

        const result = await logbookService.sincLogbook(req.user.id, req.body)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.delete('/logbooks/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const logbookDeleted = await logbookService.deleteLogbook(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: logbookDeleted
        })

    })

    return router
}

export default LogbookRouter
