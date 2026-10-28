export default class LogbookRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ userId, workoutId, sync, isDeleted }) {
    return this.prisma.logbook.findMany({
      where: {
        userId,
        workoutId,
        sync,
        isDeleted,
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            target_muscle_group: true,
            division: {
              select: {
                id: true,
                name: true,
                workout: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById({ userId, id, workoutId, sync, isDeleted }) {
    return this.prisma.logbook.findFirst({
      where: {
        userId,
        id,
        workoutId,
        sync,
        isDeleted,
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            target_muscle_group: true,
          },
        },
      },
    });
  }

  async create(data) {
    return this.prisma.logbook.create({ data });
  }

  async findByIdAndDelete(id) {
    return this.prisma.logbook.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
