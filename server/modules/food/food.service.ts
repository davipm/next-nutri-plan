import { ORPCError } from '@orpc/server';
import type { Prisma, PrismaClient } from '@/prisma/generated/prisma/client';
import type {
  CreateFoodInput,
  DeleteFoodInput,
  FindFoodInput,
  FoodFiltersInput,
  UpdateFoodInput,
} from '@/server/modules/food/food.schema';
import { prisma } from '@/server/prisma';

export type PaginateResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: {
      include: {
        servingUnit: true;
      };
    };
  };
}>;

const FOOD_INCLUDE = {
  foodServingUnits: {
    include: { servingUnit: true },
  },
} as const satisfies Prisma.FoodInclude;

class FoodService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(filters: FoodFiltersInput): Promise<PaginateResult<FoodWithServingUnits>> {
    const {
      searchTerm,
      caloriesRange = ['', ''],
      proteinRange = ['', ''],
      categoryId,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      pageSize = 10,
    } = filters;

    const where = this.buildWhereClause({
      searchTerm,
      caloriesRange,
      proteinRange,
      categoryId,
    });

    const skip = (page - 1) * pageSize;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.food.count({ where }),
      this.prisma.food.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder } as Prisma.FoodOrderByWithRelationInput,
        include: FOOD_INCLUDE,
      }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async find(data: FindFoodInput) {
    const food = await this.prisma.food.findUnique({
      where: { id: data.id },
      include: FOOD_INCLUDE,
    });

    if (!food) {
      throw new ORPCError('NOT_FOUND', {
        message: `Food with id ${data.id} not found`,
      });
    }

    return food;
  }

  async create(data: CreateFoodInput) {
    const { foodServingUnits, ...foodData } = data;

    return this.prisma.$transaction(async (tx) => {
      const food = await tx.food.create({
        data: foodData,
      });

      if (foodServingUnits?.length) {
        await this.createServingUnits(tx, food.id, foodServingUnits);
      }

      return food;
    });
  }

  async update(data: UpdateFoodInput) {
    await this.find({ id: data.id });

    const { id, foodServingUnits, ...foodData } = data;

    return this.prisma.$transaction(async (tx) => {
      const food = await tx.food.update({
        where: { id },
        data: foodData,
      });

      await tx.foodServingUnit.deleteMany({ where: { foodId: id } });

      if (foodServingUnits?.length) {
        await this.createServingUnits(tx, id, foodServingUnits);
      }

      return food;
    });
  }

  async delete(data: DeleteFoodInput) {
    await this.find({ id: data.id });

    return this.prisma.$transaction(async (tx) => {
      await tx.foodServingUnit.deleteMany({ where: { foodId: data.id } });
      return tx.food.delete({ where: { id: data.id } });
    });
  }

  private async createServingUnits(
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    foodId: number,
    servingUnits: Array<{ servingUnitId: number; grams: number }>,
  ) {
    await tx.foodServingUnit.createMany({
      data: servingUnits.map((unit) => ({
        foodId,
        servingUnitId: unit.servingUnitId,
        grams: unit.grams,
      })),
    });
  }

  private buildWhereClause({
    searchTerm,
    caloriesRange,
    proteinRange,
    categoryId,
  }: {
    searchTerm?: string;
    caloriesRange: [string, string];
    proteinRange: [string, string];
    categoryId?: string;
  }): Prisma.FoodWhereInput {
    const where: Prisma.FoodWhereInput = {};

    if (searchTerm?.trim()) {
      where.name = {
        contains: searchTerm.trim(),
        mode: 'insensitive' as const,
      };
    }

    const calorieFilter = this.buildRangeFilter(caloriesRange);
    if (calorieFilter) where.calories = calorieFilter;

    const proteinFilter = this.buildRangeFilter(proteinRange);
    if (proteinFilter) where.protein = proteinFilter;

    const categoryFilter = this.buildCategoryFilter(categoryId);
    if (categoryFilter) where.category = categoryFilter;

    return where;
  }

  private buildRangeFilter([minStr, maxStr]: [string, string]): {
    gte?: number;
    lte?: number;
  } | null {
    const min = this.parseNumericValue(minStr);
    const max = this.parseNumericValue(maxStr);

    if (min === null && max === null) return null;

    const filter: { gte?: number; lte?: number } = {};
    if (min !== null) filter.gte = min;
    if (max !== null) filter.lte = max;
    return filter;
  }

  private buildCategoryFilter(categoryId?: string): { id: number } | null {
    if (!categoryId?.trim()) return null;
    const id = this.parseNumericValue(categoryId);
    return id && id > 0 ? { id } : null;
  }

  private parseNumericValue(value: string): number | null {
    if (!value?.trim()) return null;
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }
}

export const foodService = new FoodService(prisma);
