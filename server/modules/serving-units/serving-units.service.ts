import { ORPCError } from '@orpc/server';
import type { PrismaClient } from '@/prisma/generated/prisma/client';
import type {
  DeleteServingUnitSchema,
  ListServingUnitSchema,
  ServingUnitSchema,
  UpdateServingUnitSchema,
} from '@/server/modules/serving-units/serving-units.schema';
import { prisma } from '@/server/prisma';

class ServingUnitService {
  constructor(private readonly prisma: PrismaClient) {}

  list() {
    return this.prisma.servingUnit.findMany({ orderBy: { id: 'asc' } });
  }

  async find(data: ListServingUnitSchema) {
    const servingUnit = await this.prisma.servingUnit.findUnique({ where: { id: data.id } });

    if (!servingUnit) {
      throw new ORPCError('NOT_FOUND', {
        message: `Serving unit with id ${data.id} not found`,
      });
    }

    return servingUnit;
  }

  create(data: ServingUnitSchema) {
    return this.prisma.servingUnit.create({ data });
  }

  async update(data: UpdateServingUnitSchema) {
    await this.find(data);

    return this.prisma.servingUnit.update({
      where: { id: data.id },
      data: { name: data.name },
    });
  }

  async delete(data: DeleteServingUnitSchema) {
    await this.find(data);
    return this.prisma.servingUnit.delete({ where: { id: data.id } });
  }
}

export const servingUnitService = new ServingUnitService(prisma);
