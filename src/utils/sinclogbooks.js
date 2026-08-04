import validateId from "../schemas/ids.js"
import zodError from "../utils/zoderror.js"

async function sincLogbooks(userId, exerciseId, prisma) {

    const id = validateId(Number(exerciseId))

    if (!id.success) {
        throw new Error(zodError(id.error))
    }

    const exerciseAssociated = await prisma.logbook.findFirst({
        where: {
            id: exerciseId
        }
    })

    const associatedId = exerciseAssociated.exerciseId

    const exerciseExists = await prisma.exercises.findFirst({
        where: {
            userId: userId,
            id: associatedId,
            isDeleted: false
        }
    })

    if (!exerciseExists) {
        throw new Error('Exercise associated with this logbook not found.')
    }

    const logbookExists = await prisma.logbook.findFirst({
        where: {
            userId: userId,
            id: exerciseId,
            sinc: false,
            isDeleted: false
        }
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
        userId: userId,
        exerciseId: associatedId,
        name: exerciseExists.name,
        series: exerciseExists.series,
        previous_topset_weight: exerciseExists.topset_weight,
        previous_topset_reps: exerciseExists.topset_reps,
        previous_backoff_weight: exerciseExists.backoff_weight,
        previous_backoff_reps: exerciseExists.backoff_reps
    }

    await prisma.$transaction([
        prisma.historical.create({ data: historical_data }),
        prisma.exercises.update({ where: { userId: userId, id: associatedId }, data }),
        prisma.logbook.update({ where: { userId: userId, id: logbookExists.id }, data: { sinc: true } })
    ])

    return { message: 'Logbook(s) successfully synchronized(s).' }
}

export default sincLogbooks