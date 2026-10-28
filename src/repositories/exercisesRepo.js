export default class ExercisesRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({
    userId,
    divisionId,
    workoutId,
    isDeleted,
    page = 1,
    limit = 10,
  }) {
    const skip = (page - 1) * limit;

    const [exercises, total] = await Promise.all([
      this.prisma.exercises.findMany({
        where: {
          userId,
          divisionId,
          workoutId,
          isDeleted,
        },
        orderBy: {
          id: "asc",
        },
        skip,
        take: Number(limit),
      }),
      this.prisma.exercises.count({
        where: { userId, isDeleted },
      }),
    ]);

    return { exercises, total };
  }

  async findById({ userId, exerciseId, divisionId, workoutId, isDeleted }) {
    return this.prisma.exercises.findFirst({
      where: {
        userId,
        id: exerciseId,
        divisionId,
        workoutId,
        isDeleted,
      },
      include: {
        logbooks: {
          where: {
            sync: false,
            isDeleted: false,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }

  async create(data) {
    return this.prisma.exercises.create({ data });
  }

  async findByIdAndDelete(id) {
    return this.prisma.exercises.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
