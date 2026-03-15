import {
  createFoodSchema,
  deleteFoodSchema,
  findFoodSchema,
  foodFiltersSchema,
  updateFoodSchema,
} from '@/server/modules/food/food.schema';
import { foodService } from '@/server/modules/food/food.service';
import { publicProcedure } from '@/server/orpc';

export const foodRouter = {
  list: publicProcedure
    .route({ method: 'GET' })
    .input(foodFiltersSchema)
    .handler(({ input }) => {
      return foodService.list(input);
    }),

  find: publicProcedure
    .route({ method: 'POST' })
    .input(findFoodSchema)
    .handler(({ input }) => {
      return foodService.find(input);
    }),

  create: publicProcedure
    .route({ method: 'POST' })
    .input(createFoodSchema)
    .handler(({ input }) => {
      return foodService.create(input);
    }),

  update: publicProcedure
    .route({ method: 'PUT' })
    .input(updateFoodSchema)
    .handler(({ input }) => {
      return foodService.update(input);
    }),

  delete: publicProcedure
    .route({ method: 'DELETE' })
    .input(deleteFoodSchema)
    .handler(({ input }) => {
      return foodService.delete(input);
    }),
};
