import { prisma } from "../config/infra/database.js";

async function syncLogbooks(userId, exerciseId, workoutId) {
  const logbookAssociated = await prisma.logbook.findFirst({
    where: {
      userId: userId,
      exerciseId: exerciseId,
      workoutId: workoutId,
      sync: false,
      isDeleted: false,
    },
  });

  if (!logbookAssociated) {
    throw new Error("Logbook not found for this exercise.");
  }

  const historical_data = {
    userId: userId,
    previous_topset_weight: logbookAssociated.topset_weight,
    previous_topset_reps: logbookAssociated.topset_reps,
    workoutId: logbookAssociated.workoutId,
    divisionId: logbookAssociated.divisionId,
    exerciseId: logbookAssociated.exerciseId,
    logbookId: logbookAssociated.id,
  };

  await prisma.$transaction([
    prisma.logbook.update({
      where: { id: logbookAssociated.id },
      data: { sync: true },
    }),
    prisma.historical.create({ data: historical_data }),
  ]);

  return { message: "Logbook successfully synchronized." };
}

export default syncLogbooks;
