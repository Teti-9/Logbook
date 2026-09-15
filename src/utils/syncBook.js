import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";

async function syncLogbooks(userId, exerciseId, prisma) {
  const id = Number(exerciseId);
  const fieldConfig = { id: "number" };

  const result = validateFields({ id: id }, fieldConfig);

  if (!result.success) {
    throw new Error(parseError(result.error));
  }

  const exerciseAssociated = await prisma.logbook.findFirst({
    where: {
      id: id,
      userId: userId,
      isDeleted: false,
    },
  });

  const associatedId = exerciseAssociated.exerciseId;

  const exerciseExists = await prisma.exercises.findFirst({
    where: {
      userId: userId,
      id: associatedId,
      isDeleted: false,
    },
  });

  if (!exerciseExists) {
    throw new Error("Exercise associated with this logbook does not exist.");
  }

  const logbookExists = await prisma.logbook.findFirst({
    where: {
      userId: userId,
      id: id,
      sync: false,
      isDeleted: false,
    },
  });

  if (!logbookExists) {
    throw new Error("Logbook not found for this exercise.");
  }

  const data = {
    topset_weight: logbookExists.topset_weight,
    topset_reps: logbookExists.topset_reps,
    extra: logbookExists.extra,
  };

  const historical_data = {
    userId: userId,
    exerciseId: associatedId,
    previous_topset_weight: exerciseExists.topset_weight,
    previous_topset_reps: exerciseExists.topset_reps,
    extra: exerciseExists.extra,
  };

  await prisma.$transaction([
    prisma.historical.create({ data: historical_data }),
    prisma.exercises.update({
      where: { userId: userId, id: associatedId },
      data,
    }),
    prisma.logbook.update({
      where: { userId: userId, id: logbookExists.id },
      data: { sync: true },
    }),
  ]);

  return { message: "Logbook(s) successfully synchronized(s)." };
}

export default syncLogbooks;
