import { ORPCError } from '@orpc/server';
import type { Prisma, PrismaClient } from '@/prisma/generated/prisma/client';
import type {
  CreateMealInput,
  DeleteMealInput,
  FindMealInput,
  MealFiltersInput,
  MealFoodInput,
  UpdateMealInput,
} from '@/server/modules/meal/meal.schema';
import { prisma } from '@/server/prisma';

export type MealWithRelations = Prisma.MealGetPayload<{
  include: {
    mealFoods: {
      include: {
        food: true;
        servingUnit: true;
      };
    };
  };
}>;

const MEAL_INCLUDE = {
  mealFoods: {
    include: {
      food: true,
      servingUnit: true,
    },
  },
} as const satisfies Prisma.MealInclude;

class MealService {
  constructor(private readonly prisma: PrismaClient) {}

  list(userId: string, filters: MealFiltersInput): Promise<MealWithRelations[]> {
    return this.prisma.meal.findMany({
      where: this.buildWhereClause(userId, filters),
      orderBy: { dateTime: 'desc' },
      include: MEAL_INCLUDE,
    });
  }

  async find(userId: string, data: FindMealInput) {
    const meal = await this.prisma.meal.findFirst({
      where: {
        id: data.id,
        userId,
      },
      include: MEAL_INCLUDE,
    });

    if (!meal) {
      throw new ORPCError('NOT_FOUND', {
        message: `Meal with id ${data.id} not found`,
      });
    }

    return meal;
  }

  create(userId: string, data: CreateMealInput) {
    const { dateTime, mealFoods = [] } = data;

    return this.prisma.$transaction(async (tx) => {
      const meal = await tx.meal.create({
        data: {
          userId,
          dateTime,
        },
      });

      await this.replaceMealFoods(tx, meal.id, mealFoods);

      return tx.meal.findUniqueOrThrow({
        where: { id: meal.id },
        include: MEAL_INCLUDE,
      });
    });
  }

  async update(userId: string, data: UpdateMealInput) {
    await this.find(userId, { id: data.id });

    const { id, dateTime, mealFoods = [] } = data;

    return this.prisma.$transaction(async (tx) => {
      await tx.meal.update({
        where: { id },
        data: { dateTime },
      });

      await tx.mealFood.deleteMany({
        where: { mealId: id },
      });

      await this.replaceMealFoods(tx, id, mealFoods);

      return tx.meal.findUniqueOrThrow({
        where: { id },
        include: MEAL_INCLUDE,
      });
    });
  }

  async delete(userId: string, data: DeleteMealInput) {
    await this.find(userId, { id: data.id });

    return this.prisma.$transaction(async (tx) => {
      await tx.mealFood.deleteMany({
        where: { mealId: data.id },
      });

      return tx.meal.delete({
        where: { id: data.id },
      });
    });
  }

  private buildWhereClause(userId: string, filters: MealFiltersInput): Prisma.MealWhereInput {
    const where: Prisma.MealWhereInput = { userId };

    if (filters.dateTime) {
      const startDate = new Date(filters.dateTime);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(filters.dateTime);
      endDate.setHours(23, 59, 59, 999);

      where.dateTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    return where;
  }

  private async replaceMealFoods(
    tx: Prisma.TransactionClient,
    mealId: number,
    mealFoods: MealFoodInput[]
  ) {
    if (!mealFoods.length) {
      return;
    }

    await tx.mealFood.createMany({
      data: mealFoods.map((mealFood) => ({
        mealId,
        foodId: mealFood.foodId,
        servingUnitId: mealFood.servingUnitId,
        amount: mealFood.amount,
      })),
    });
  }
}

export const mealService = new MealService(prisma);
