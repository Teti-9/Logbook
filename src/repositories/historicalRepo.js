export default class HistoricalRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ userId, search, workoutId, isDeleted }) {
    return this.prisma.historical.findMany({
      where: {
        userId,
        workoutId,
        isDeleted,
        ...(search && {
          exercise: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            advanced_technique: true,
            observation: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async findById({ userId, historicalId, workoutId, isDeleted }) {
    return this.prisma.historical.findFirst({
      where: {
        userId,
        id: historicalId,
        workoutId,
        isDeleted,
      },
    });
  }

  async create(data) {
    return this.prisma.historical.create({ data });
  }

  async findByIdAndDelete(id) {
    return this.prisma.historical.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
