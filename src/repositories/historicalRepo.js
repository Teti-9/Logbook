export default class HistoricalRepo {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll(userId, isDeleted, search) {
    return this.prisma.historical.findMany({
      where: {
        userId,
        isDeleted,
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      include: {
        exercises: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            series: true,
            rest: true,
            advanced_technique: true,
            observation: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async findById(where) {
    return this.prisma.historical.findFirst({
      where,
    });
  }

  async findOne(where) {
    return this.prisma.historical.findFirst({
      where,
    });
  }

  async create(data) {
    return this.prisma.historical.create({ data });
  }

  async findByIdAndUpdate(id, data) {
    return this.prisma.historical.update({ where: { id }, data });
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
