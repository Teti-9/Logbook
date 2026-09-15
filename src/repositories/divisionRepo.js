export default class DivisionRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll({ userId, isDeleted }, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [divisions, total] = await Promise.all([
      this.prisma.division.findMany({
        where: {
          userId,
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
        orderBy: {
          id: "asc",
        },
        skip,
        take: Number(limit),
      }),
      this.prisma.division.count({ where: { userId, isDeleted } }),
    ]);

    return { divisions, total };
  }

  async findById(where) {
    return this.prisma.division.findFirst({
      where,
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

  async findOne(where) {
    return this.prisma.division.findFirst({
      where,
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

  async findByIdAndUpdate(id, data) {
    return this.prisma.division.update({ where: { id }, data });
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
