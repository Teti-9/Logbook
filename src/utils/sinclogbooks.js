async function sincLogbooks(exerciseId, exercisesRepo, logbookRepo, historicalRepo) {

    const exerciseExists = await exercisesRepo.findById({
        id: exerciseId,
        isDeleted: false
    })

    if (!exerciseExists) {
        throw new Error('Exercise associated with this logbook not found.')
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
        topset_weight: logbookExists.topset_weight,
        topset_reps: logbookExists.topset_reps,
        backoff_weight: logbookExists.backoff_weight,
        backoff_reps: logbookExists.backoff_reps
    }

    const historical_data = {
        exerciseId: exerciseId,
        name: exerciseExists.name,
        series: exerciseExists.series,
        previous_topset_weight: exerciseExists.topset_weight,
        previous_topset_reps: exerciseExists.topset_reps,
        previous_backoff_weight: exerciseExists.backoff_weight,
        previous_backoff_reps: exerciseExists.backoff_reps
    }

    const create_historical = await historicalRepo.create(historical_data)

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