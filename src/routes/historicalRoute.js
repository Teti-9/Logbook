import express from 'express'

const HistoricalRouter = (historicalService) => {
    const router = express.Router()

    router.get('/historical', async (req, res) => {

        const result = await historicalService.getHistorical()

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/historical/:id', async (req, res) => {

        const { id } = req.params

        const result = await historicalService.getHistoricalById(id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.delete('/delete_historical/:id', async (req, res) => {

        const { id } = req.params

        const historicalDeleted = await historicalService.deleteHistorical(id)

        return res.status(200).json({
            success: true,
            data: historicalDeleted
        })

    })

    return router
}

export default HistoricalRouter
