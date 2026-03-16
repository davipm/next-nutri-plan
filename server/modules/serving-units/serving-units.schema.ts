import { z } from 'zod';

export const servingUnitSchema = z.object({
  name: z.string().min(1).max(255),
});

export const createServingUnitSchema = z.object({
  name: z.string().min(1).max(255),
});

export const listServingUnitSchema = z.object({
  id: z.number().min(1),
});

export const updateServingUnitSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1).max(255),
});

export const deleteServingUnitSchema = z.object({ id: z.number().min(1) });

export type ServingUnitSchema = z.infer<typeof servingUnitSchema>;
export type CreateServingUnitSchema = z.infer<typeof createServingUnitSchema>;
export type ListServingUnitSchema = z.infer<typeof listServingUnitSchema>;
export type UpdateServingUnitSchema = z.infer<typeof updateServingUnitSchema>;
export type DeleteServingUnitSchema = z.infer<typeof deleteServingUnitSchema>;
