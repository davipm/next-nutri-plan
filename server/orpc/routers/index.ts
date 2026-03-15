import type { RouterClient } from '@orpc/server';
import { categoryRouter } from '@/server/modules/category/category.router';
import { foodRouter } from '@/server/modules/food/food.router';
import { mealRouter } from '@/server/modules/meal/meal.router';
import { servingUnitRouter } from '@/server/modules/serving-units/serving-units.router';
import { protectedProcedure, publicProcedure } from '@/server/orpc';

export const appRouter = {
  categories: categoryRouter,
  foods: foodRouter,
  meals: mealRouter,
  servingUnits: servingUnitRouter,
  healthCheck: publicProcedure.handler(() => 'OK'),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: 'This is private',
    user: context.session?.user,
  })),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
