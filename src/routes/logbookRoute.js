import express from 'express'

const LogbookRouter = (logbookService) => {
    const router = express.Router()

    router.get('/logbooks', async (req, res) => {

        const result = await logbookService.getLogbooks()

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/logbook/:id', async (req, res) => {

        const { id } = req.params

        const result = await logbookService.getLogbookById(id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.post('/logbook', async (req, res) => {

        const logbookCreated = await logbookService.createLogbook(req.body)

        return res.status(201).json({
            success: true,
            data: logbookCreated
        })

    })

    router.post('/sinclogbook', async (req, res) => {

        const result = await logbookService.sincLogbook(req.body)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.delete('/delete_logbook/:id', async (req, res) => {

        const { id } = req.params

        const logbookDeleted = await logbookService.deleteLogbook(id)

        return res.status(200).json({
            success: true,
            data: logbookDeleted
        })

    })

    return router
}

export default LogbookRouter
