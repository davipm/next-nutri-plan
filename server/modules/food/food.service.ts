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

// Typed payload for food with serving units
export type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: {
      include: {
        servingUnit: true;
      };
    };
  };
}>;

class FoodService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Fetches paginated foods with filters and sorting
   */
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
        include: {
          foodServingUnits: {
            include: { servingUnit: true },
          },
        },
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

  /**
   * Retrieves a single food item with serving units
   */
  async find(data: FindFoodInput) {
    const food = await this.prisma.food.findUnique({
      where: { id: data.id },
      include: {
        foodServingUnits: {
          include: { servingUnit: true },
        },
      },
    });

    if (!food) {
      throw new ORPCError('NOT_FOUND', {
        message: `Food with id ${data.id} not found`,
      });
    }

    return food;
  }

  /**
   * Creates a new food item with serving units
   */
  async create(data: CreateFoodInput) {
    return this.prisma.$transaction(async (tx) => {
      const food = await tx.food.create({
        data: {
          name: data.name,
          calories: data.calories,
          carbohydrates: data.carbohydrates,
          fat: data.fat,
          protein: data.protein,
          categoryId: data.categoryId,
          sugar: data.sugar,
          fiber: data.fiber,
        },
      });

      if (data.foodServingUnits?.length) {
        await tx.foodServingUnit.createMany({
          data: data.foodServingUnits.map((unit) => ({
            foodId: food.id,
            servingUnitId: unit.servingUnitId,
            grams: unit.grams,
          })),
        });
      }

      return food;
    });
  }

  /**
   * Updates an existing food item and its serving units
   */
  async update(data: UpdateFoodInput) {
    // Verify existence before update
    await this.find({ id: data.id });

    return this.prisma.$transaction(async (tx) => {
      const food = await tx.food.update({
        where: { id: data.id },
        data: {
          name: data.name,
          calories: data.calories,
          carbohydrates: data.carbohydrates,
          fat: data.fat,
          protein: data.protein,
          categoryId: data.categoryId,
          sugar: data.sugar,
          fiber: data.fiber,
        },
      });

      // Replace all serving units
      await tx.foodServingUnit.deleteMany({ where: { foodId: data.id } });

      if (data.foodServingUnits?.length) {
        await tx.foodServingUnit.createMany({
          data: data.foodServingUnits.map((unit) => ({
            foodId: food.id,
            servingUnitId: unit.servingUnitId,
            grams: unit.grams,
          })),
        });
      }

      return food;
    });
  }

  /**
   * Deletes a food item and its associated serving units
   */
  async delete(data: DeleteFoodInput) {
    // Verify existence before delete
    await this.find({ id: data.id });

    return this.prisma.$transaction(async (tx) => {
      await tx.foodServingUnit.deleteMany({ where: { foodId: data.id } });
      return tx.food.delete({ where: { id: data.id } });
    });
  }

  // =============== PRIVATE HELPERS ===============
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
