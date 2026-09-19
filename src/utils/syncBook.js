import validateFields from "../schemas/zodFields.js";
import parseError from "../schemas/zodError.js";
import { prisma } from "../config/infra/database.js";

async function syncLogbooks(userId, exerciseId) {
  const id = Number(exerciseId);
  const fieldConfig = { id: "number" };

  const result = validateFields({ id: id }, fieldConfig);

  if (!result.success) {
    throw new Error(parseError(result.error));
  }

  const logbookAssociated = await prisma.logbook.findFirst({
    where: {
      exerciseId: id,
      userId: userId,
      sync: false,
      isDeleted: false,
    },
  });

  if (!logbookAssociated) {
    throw new Error("Logbook not found for this exercise.");
  }

  const historical_data = {
    exerciseId: id,
    previous_topset_weight: logbookAssociated.topset_weight,
    previous_topset_reps: logbookAssociated.topset_reps,
    extra: logbookAssociated.extra,
    userId: userId,
  };

  await prisma.$transaction([
    prisma.historical.create({ data: historical_data }),
    prisma.logbook.update({
      where: { userId: userId, id: logbookAssociated.id },
      data: { sync: true },
    }),
  ]);

  return { message: "Logbook(s) successfully synchronized(s)." };
}

export default syncLogbooks;
