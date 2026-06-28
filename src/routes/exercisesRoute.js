import express from 'express'
import validateId from "../schemas/ids.js"
import validateFields from "../schemas/fields.js"
import zodError from "../utils/zoderror.js"

const ExercisesRouter = (exercisesService) => {
    const router = express.Router()

    router.get('/exercises', async (req, res) => {

        const result = await exercisesService.getExercises()

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

        const result = await exercisesService.getExerciseById(id.data.id)

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
            divisionId: "number",
        }

        const result = validateFields(req.body, fieldConfig)

        if (!result.success) {
            throw new Error(zodError(result.error))
        }

        const exerciseCreated = await exercisesService.createExercise(req.body)

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

        const exerciseDeleted = await exercisesService.deleteExercise(id.data.id)

        return res.status(200).json({
            success: true,
            data: exerciseDeleted
        })

    })

    return router
}

export default ExercisesRouter
