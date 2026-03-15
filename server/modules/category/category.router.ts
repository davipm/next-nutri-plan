import {
  categorySchema,
  createCategorySchema,
  deleteCategorySchema,
  listCategorySchema,
  updateCategorySchema,
} from '@/server/modules/category/category.schema';
import { protectedProcedure } from '@/server/orpc';
import { categoryService } from './category.service';

export const categoryRouter = {
  list: protectedProcedure.route({ method: 'GET' }).handler(() => {
    return categoryService.list();
  }),

  find: protectedProcedure
    .route({ method: 'POST' })
    .input(listCategorySchema)
    .handler(({ input }) => {
      return categoryService.find(input);
    }),

  create: protectedProcedure
    .route({ method: 'POST' })
    .input(createCategorySchema)
    .output(categorySchema)
    .handler(({ input }) => {
      return categoryService.create(input);
    }),

  update: protectedProcedure
    .route({ method: 'PUT' })
    .input(updateCategorySchema)
    .output(categorySchema)
    .handler(({ input }) => {
      return categoryService.update(input);
    }),

  delete: protectedProcedure
    .route({ method: 'DELETE' })
    .input(deleteCategorySchema)
    .output(categorySchema)
    .handler(({ input }) => {
      return categoryService.delete(input);
    }),
};
