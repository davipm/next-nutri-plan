import {
  categorySchema,
  createCategorySchema,
  deleteCategorySchema,
  listCategorySchema,
  updateCategorySchema,
} from '@/server/modules/category/category.schema';
import { publicProcedure } from '@/server/orpc';
import { categoryService } from './category.service';

export const categoryRouter = {
  list: publicProcedure.route({ method: 'GET' }).handler(() => {
    return categoryService.list();
  }),

  find: publicProcedure
    .route({ method: 'POST' })
    .input(listCategorySchema)
    .handler(({ input }) => {
      return categoryService.find(input);
    }),

  create: publicProcedure
    .route({ method: 'POST' })
    .input(createCategorySchema)
    .output(categorySchema)
    .handler(({ input }) => {
      return categoryService.create(input);
    }),

  update: publicProcedure
    .route({ method: 'PUT' })
    .input(updateCategorySchema)
    .output(categorySchema)
    .handler(({ input }) => {
      return categoryService.update(input);
    }),

  delete: publicProcedure
    .route({ method: 'DELETE' })
    .input(deleteCategorySchema)
    .output(categorySchema)
    .handler(({ input }) => {
      return categoryService.delete(input);
    }),
};
