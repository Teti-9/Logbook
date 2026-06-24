export default class ExercisesService {
    constructor(exercisesRepo, divisionRepo) {
        this.exercisesRepo = exercisesRepo
        this.divisionRepo = divisionRepo
    }

    async getExercises() {

        const exercises = await this.exercisesRepo.findAll({
            isDeleted: false
        })

        if (!exercises || exercises.length === 0) {
            const error = new Error('No exercises found.')
            error.statusCode = 404
            throw error
        }

        return exercises
    }

    async getExerciseById(id) {
        const exerciseId = Number(id)

        const exercise = await this.exercisesRepo.findById({
            id: exerciseId,
            isDeleted: false
        })

        if (!exercise) {
            const error = new Error('Exercise not found.')
            error.statusCode = 404
            throw error
        }

        return exercise
    }

    async createExercise(body) {
        const divisionId = Number(body.divisionId)

        const divisionExists = await this.divisionRepo.findById({
            id: divisionId,
            isDeleted: false
        })

        if (!divisionExists) {
            const error = new Error('Division not found.')
            error.statusCode = 404
            throw error
        }

        const newData = {
            ...body
        }

        await this.exercisesRepo.create(newData)

        return { message: 'Exercise successfully created.' }
    }

    async deleteExercise(id) {
        const exerciseId = Number(id)

        const exercise = await this.exercisesRepo.findById({
            id: exerciseId,
            isDeleted: false
        })

        if (!exercise) {
            const error = new Error('Exercise not found.')
            error.statusCode = 404
            throw error
        }

        await this.exercisesRepo.findByIdAndDelete(exerciseId)

        return { message: 'Exercise successfully deleted.' }
    }
}
