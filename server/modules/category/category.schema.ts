import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1).max(255),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
});

export const listCategorySchema = z.object({
  id: z.number().min(1),
});

export const updateCategorySchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1).max(255),
});

export const deleteCategorySchema = z.object({ id: z.number().min(1) });

export type CategorySchema = z.infer<typeof categorySchema>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type ListCategorySchema = z.infer<typeof listCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>;
