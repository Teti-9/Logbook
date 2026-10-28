export default class DivisionRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ userId, workoutId, isDeleted, page = 1, limit = 10 }) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [divisions, total] = await Promise.all([
      this.prisma.division.findMany({
        where: {
          userId,
          workoutId,
          isDeleted,
        },
        include: {
          workout: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
        skip,
        take,
      }),
      this.prisma.division.count({ where: { userId, workoutId, isDeleted } }),
    ]);

    return { divisions, total };
  }

  async findById({ userId, divisionId, workoutId, isDeleted }) {
    return this.prisma.division.findFirst({
      where: {
        userId,
        id: divisionId,
        workoutId,
        isDeleted,
      },
      include: {
        exercises: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findOne({ userId, day, workoutId, isDeleted }) {
    return this.prisma.division.findFirst({
      where: {
        userId,
        day,
        workoutId,
        isDeleted,
      },
      include: {
        exercises: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            target_muscle_group: true,
            series_reps: true,
            rest: true,
            advanced_technique: true,
            observation: true,
          },
        },
      },
    });
  }

  async create(data) {
    return this.prisma.division.create({ data });
  }

  async findByIdAndDelete(id) {
    return this.prisma.division.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
