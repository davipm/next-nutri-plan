import { foodFiltersSchema } from '@/server/modules/food/food.schema';
import { foodService } from '@/server/modules/food/food.service';
import { publicProcedure } from '@/server/orpc';

export const foodRouter = {
  list: publicProcedure
    .route({ method: 'GET' })
    .input(foodFiltersSchema)
    .handler(({ input }) => {
      return foodService.list(input);
    }),
};
