import {
  createMealSchema,
  deleteMealSchema,
  findMealSchema,
  mealFiltersSchema,
  updateMealSchema,
} from '@/server/modules/meal/meal.schema';
import { mealService } from '@/server/modules/meal/meal.service';
import { protectedProcedure } from '@/server/orpc';

export const mealRouter = {
  list: protectedProcedure
    .route({ method: 'GET' })
    .input(mealFiltersSchema)
    .handler(({ context, input }) => {
      return mealService.list(context.session.user.id, input);
    }),

  find: protectedProcedure
    .route({ method: 'POST' })
    .input(findMealSchema)
    .handler(({ context, input }) => {
      return mealService.find(context.session.user.id, input);
    }),

  create: protectedProcedure
    .route({ method: 'POST' })
    .input(createMealSchema)
    .handler(({ context, input }) => {
      return mealService.create(context.session.user.id, input);
    }),

  update: protectedProcedure
    .route({ method: 'PUT' })
    .input(updateMealSchema)
    .handler(({ context, input }) => {
      return mealService.update(context.session.user.id, input);
    }),

  delete: protectedProcedure
    .route({ method: 'DELETE' })
    .input(deleteMealSchema)
    .handler(({ context, input }) => {
      return mealService.delete(context.session.user.id, input);
    }),
};
