import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const HistoricalRouter = (historicalService) => {
    const router = express.Router()

    router.get('/historicals', async (req, res) => {

        const result = await historicalService.getHistorical(req.user.id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/historicals/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const result = await historicalService.getHistoricalById(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.delete('/historicals/:id', async (req, res) => {

        const id = validateId(Number(req.params.id))

        if (!id.success) {
            throw new Error(zodError(id.error))
        }

        const historicalDeleted = await historicalService.deleteHistorical(req.user.id, id.data.id)

        return res.status(200).json({
            success: true,
            data: historicalDeleted
        })

    })

    return router
}

export default HistoricalRouter
