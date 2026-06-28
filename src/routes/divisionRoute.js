import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const DivisionRouter = (divisionService) => {
    const router = express.Router()

    router.get('/divisions', async (req, res) => {

        const result = await divisionService.getDivisions()

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

        const result = await divisionService.getDivisionById(id.data.id)

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

        const divisionCreated = await divisionService.createDivision(req.body)

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

        const divisionDeleted = await divisionService.deleteDivision(id.data.id)

        return res.status(200).json({
            success: true,
            data: divisionDeleted
        })

    })

    return router
}

export default DivisionRouter
