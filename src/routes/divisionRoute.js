import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const DivisionRouter = (divisionService) => {
    const router = express.Router()

    /**
 * @swagger
 * 
 * /api/divisions:
 *   get:
 *     summary: Return all divisions.
 *     tags: [Division]
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
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       200:
 *         description: Success.
 *       404:
 *         description: No divisions found.
 *       500:
 *         description: There was an internal server error.
 * 
 *   post:
 *     summary: Create a new division.
 *     tags: [Division]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Push, Pull, etc..."
 *               day:
 *                 type: string
 *                 example: "Monday, Tuesday..."
 *     responses:
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       201:
 *         description: Training split successfully created.
 *       400:
 *         description: A training split for this day already exists.
 *       500:
 *         description: There was an internal server error.
 * 
 * /api/divisions/{id}:
 *   get:
 *     summary: Return a single division.
 *     tags: [Division]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Division ID.
 *     responses:
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       200:
 *         description: Success.
 *       404:
 *         description: Division not found.
 *       500:
 *         description: There was an internal server error.
 * 
 *   delete:
 *     summary: Soft-delete a division.
 *     tags: [Division]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Division ID to be deleted.
 *     responses:
 *       401:
 *         description: Token not included.
 *       403:
 *         description: Expired or invalid token.
 *       200:
 *         description: Division successfully deleted.
 *       404:
 *         description: Division not found.
 *       500:
 *         description: There was an internal server error.
 */

    router.get('/divisions', async (req, res) => {

        const { page, limit } = req.query

        const result = await divisionService.getDivisions(req.user.id, { page, limit })

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/divisions/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const result = await divisionService.getDivisionById(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.post('/divisions', async (req, res) => {

        const fieldConfig = { name: "string", day: "string" }

        const result = validateFields(req.body, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const divisionCreated = await divisionService.createDivision(req.user.id, req.body)

        return res.status(201).json({
            success: true,
            data: divisionCreated
        })

    })

    router.delete('/divisions/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const divisionDeleted = await divisionService.deleteDivision(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: divisionDeleted
        })

    })

    return router
}

export default DivisionRouter
