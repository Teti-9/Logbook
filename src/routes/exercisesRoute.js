import express from 'express'

const ExercisesRouter = (exercisesService) => {
    const router = express.Router()

    router.get('/exercises', async (req, res) => {

        const result = await exercisesService.getExercises()

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.get('/exercise/:id', async (req, res) => {

        const { id } = req.params

        const result = await exercisesService.getExerciseById(id)

        return res.status(200).json({
            success: true,
            data: result
        })

    })

    router.post('/exercise', async (req, res) => {

        const exerciseCreated = await exercisesService.createExercise(req.body)

        return res.status(201).json({
            success: true,
            data: exerciseCreated
        })

    })

    router.delete('/delete_exercise/:id', async (req, res) => {

        const { id } = req.params

        const exerciseDeleted = await exercisesService.deleteExercise(id)

        return res.status(200).json({
            success: true,
            data: exerciseDeleted
        })

    })

    return router
}

export default ExercisesRouter
