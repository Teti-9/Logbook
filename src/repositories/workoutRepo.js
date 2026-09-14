export default class WorkoutRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ userId, isDeleted }, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      this.prisma.workout.findMany({
        where: {
          userId,
          isDeleted,
        },
        include: {
          divisions: {
            where: {
              isDeleted: false,
            },
            select: {
              id: true,
              name: true,
              day: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
        skip,
        take: Number(limit),
      }),
      this.prisma.workout.count({ where: { userId, isDeleted } }),
    ]);

    return { workouts, total };
  }

  async findById(where) {
    return this.prisma.workout.findFirst({
      where,
      include: {
        divisions: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            day: true,
          },
        },
      },
    });
  }

  async findOne(where) {
    return this.prisma.workout.findFirst({
      where,
      include: {
        divisions: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            day: true,
          },
        },
      },
    });
  }

  async create(data) {
    return this.prisma.workout.create({ data });
  }

  async findByIdAndUpdate(id, data) {
    return this.prisma.workout.update({ where: { id }, data });
  }

  async findByIdAndDelete(id) {
    return this.prisma.workout.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
