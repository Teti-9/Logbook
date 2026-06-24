async function sincLogbooks(exerciseId, exercisesRepo, logbookRepo) {

    const exerciseExists = await exercisesRepo.findById({
        id: exerciseId,
        isDeleted: false
    })

    if (!exerciseExists) {
        throw new Error('Exercise not found.')
    }

    const logbookExists = await logbookRepo.findById({
        exerciseId,
        sinc: false,
        isDeleted: false
    })

    if (!logbookExists) {
        throw new Error('Logbook not found for this exercise.')
    }

    const data = {
        weight: logbookExists.weight,
        reps: logbookExists.reps
    }

    const sincExercise = await exercisesRepo.findByIdAndUpdate(
        exerciseId,
        data,
    )

    if (!sincExercise) {
        throw new Error('Error while synchronizing exercise.')
    }

    await logbookRepo.findByIdAndUpdate(logbookExists.id, { sinc: true })

    return { message: 'Logbook successfully synchronized.' }
}

export default sincLogbooks