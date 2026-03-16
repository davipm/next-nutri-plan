import { ORPCError } from '@orpc/server';
import type { PrismaClient } from '@/prisma/generated/prisma/client';
import type {
  CategorySchema,
  DeleteCategorySchema,
  ListCategorySchema,
  UpdateCategorySchema,
} from '@/server/modules/category/category.schema';
import { prisma } from '@/server/prisma';

class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  list() {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  async find(data: ListCategorySchema) {
    const category = await this.prisma.category.findUnique({ where: { id: data.id } });

    if (!category) {
      throw new ORPCError('NOT_FOUND', {
        message: `Todo with id ${data.id} not found`,
      });
    }

    return category;
  }

  create(data: CategorySchema) {
    return this.prisma.category.create({ data });
  }

  async update(data: UpdateCategorySchema) {
    await this.find(data);

    return this.prisma.category.update({
      where: { id: data.id },
      data: { name: data.name },
    });
  }

  async delete(data: DeleteCategorySchema) {
    await this.find(data);
    return this.prisma.category.delete({ where: { id: data.id } });
  }
}

export const categoryService = new CategoryService(prisma);
