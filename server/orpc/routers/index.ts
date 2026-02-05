import type { RouterClient } from '@orpc/server';
import { categoryRouter } from '@/server/modules/category/category.router';
import { foodRouter } from '@/server/modules/food/food.router';
import { protectedProcedure, publicProcedure } from '@/server/orpc';

export const appRouter = {
  categories: categoryRouter,
  foods: foodRouter,
  healthCheck: publicProcedure.handler(() => 'OK'),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: 'This is private',
    user: context.session?.user,
  })),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
