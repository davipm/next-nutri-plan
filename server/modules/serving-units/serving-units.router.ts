import {
  createServingUnitSchema,
  deleteServingUnitSchema,
  listServingUnitSchema,
  updateServingUnitSchema,
} from '@/server/modules/serving-units/serving-units.schema';
import { servingUnitService } from '@/server/modules/serving-units/serving-units.service';
import { publicProcedure } from '@/server/orpc';

export const servingUnitRouter = {
  list: publicProcedure.route({ method: 'GET' }).handler(() => {
    return servingUnitService.list();
  }),

  find: publicProcedure
    .route({ method: 'POST' })
    .input(listServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.find(input);
    }),

  create: publicProcedure
    .route({ method: 'POST' })
    .input(createServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.create(input);
    }),

  update: publicProcedure
    .route({ method: 'PUT' })
    .input(updateServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.update(input);
    }),

  delete: publicProcedure
    .route({ method: 'DELETE' })
    .input(deleteServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.delete(input);
    }),
};
