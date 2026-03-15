import {
  createFoodSchema,
  deleteFoodSchema,
  findFoodSchema,
  foodFiltersSchema,
  updateFoodSchema,
} from '@/server/modules/food/food.schema';
import { foodService } from '@/server/modules/food/food.service';
import { protectedProcedure } from '@/server/orpc';

export const foodRouter = {
  list: protectedProcedure
    .route({ method: 'GET' })
    .input(foodFiltersSchema)
    .handler(({ input }) => {
      return foodService.list(input);
    }),

  find: protectedProcedure
    .route({ method: 'POST' })
    .input(findFoodSchema)
    .handler(({ input }) => {
      return foodService.find(input);
    }),

  create: protectedProcedure
    .route({ method: 'POST' })
    .input(createFoodSchema)
    .handler(({ input }) => {
      return foodService.create(input);
    }),

  update: protectedProcedure
    .route({ method: 'PUT' })
    .input(updateFoodSchema)
    .handler(({ input }) => {
      return foodService.update(input);
    }),

  delete: protectedProcedure
    .route({ method: 'DELETE' })
    .input(deleteFoodSchema)
    .handler(({ input }) => {
      return foodService.delete(input);
    }),
};
