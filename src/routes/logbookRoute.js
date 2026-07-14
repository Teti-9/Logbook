import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const LogbookRouter = (logbookService) => {
    const router = express.Router()

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

        if (!req.body.backoff_weight) {
            req.body.backoff_weight = 0
        }

        if (!req.body.backoff_reps) {
            req.body.backoff_reps = 0
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
