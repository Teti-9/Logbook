import express from 'express'

const DivisionRouter = (divisionService) => {
    const router = express.Router()

    router.get('/divisions', async (req, res) => {

        const result = await divisionService.getDivisions()

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/division/:id', async (req, res) => {

        const { id } = req.params

        const result = await divisionService.getDivisionById(id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.post('/division', async (req, res) => {

        const divisionCreated = await divisionService.createDivision(req.body)

        return res.status(201).json({
            success: true,
            data: divisionCreated
        })

    })

    router.delete('/delete_division/:id', async (req, res) => {

        const { id } = req.params

        const divisionDeleted = await divisionService.deleteDivision(id)

        return res.status(200).json({
            success: true,
            data: divisionDeleted
        })

    })

    return router
}

export default DivisionRouter
