import {
  createServingUnitSchema,
  deleteServingUnitSchema,
  listServingUnitSchema,
  updateServingUnitSchema,
} from '@/server/modules/serving-units/serving-units.schema';
import { servingUnitService } from '@/server/modules/serving-units/serving-units.service';
import { protectedProcedure } from '@/server/orpc';

export const servingUnitRouter = {
  list: protectedProcedure.route({ method: 'GET' }).handler(() => {
    return servingUnitService.list();
  }),

  find: protectedProcedure
    .route({ method: 'POST' })
    .input(listServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.find(input);
    }),

  create: protectedProcedure
    .route({ method: 'POST' })
    .input(createServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.create(input);
    }),

  update: protectedProcedure
    .route({ method: 'PUT' })
    .input(updateServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.update(input);
    }),

  delete: protectedProcedure
    .route({ method: 'DELETE' })
    .input(deleteServingUnitSchema)
    .handler(({ input }) => {
      return servingUnitService.delete(input);
    }),
};
