import { z } from 'zod';

// ===== BASE SCHEMAS =====

export const servingUnitSchema = z.object({
  servingUnitId: z.number().min(1, 'Serving unit ID is required'),
  grams: z.number().min(0.1, 'Grams must be greater than 0'),
});

export const baseFoodSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  calories: z.number().min(0, 'Calories must be non-negative'),
  carbohydrates: z.number().min(0, 'Carbohydrates must be non-negative'),
  fat: z.number().min(0, 'Fat must be non-negative'),
  protein: z.number().min(0, 'Protein must be non-negative'),
  sugar: z.number().min(0, 'Sugar must be non-negative').optional().default(0),
  fiber: z.number().min(0, 'Fiber must be non-negative').optional().default(0),
  categoryId: z.number().min(1, 'Category ID must be positive').optional().nullable(),
  foodServingUnits: z.array(servingUnitSchema).min(1, 'At least one serving unit is required'),
});

export type BaseFoodSchema = z.infer<typeof baseFoodSchema>;

// ===== INPUT SCHEMAS =====

// List/Filter schema
export const foodFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  caloriesRange: z.tuple([z.string(), z.string()]).optional().default(['', '']),
  proteinRange: z.tuple([z.string(), z.string()]).optional().default(['', '']),
  categoryId: z.string().optional(),
  sortBy: z.enum(['name', 'calories', 'protein', 'createdAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(100).optional().default(10),
});

export type FoodFiltersInput = z.infer<typeof foodFiltersSchema>;

// Find schema
export const findFoodSchema = z.object({
  id: z.number().min(1, 'Food ID must be positive'),
});

export type FindFoodInput = z.infer<typeof findFoodSchema>;

// Create schema
export const createFoodSchema = baseFoodSchema.extend({
  foodServingUnits: z.array(servingUnitSchema).min(1, 'At least one serving unit is required'),
});

export type CreateFoodInput = z.infer<typeof createFoodSchema>;

// Update schema
export const updateFoodSchema = baseFoodSchema.extend({
  id: z.number().min(1, 'Food ID must be positive'),
  foodServingUnits: z.array(servingUnitSchema).min(1, 'At least one serving unit is required'),
});

export type UpdateFoodInput = z.infer<typeof updateFoodSchema>;

// Delete schema
export const deleteFoodSchema = z.object({
  id: z.number().min(1, 'Food ID must be positive'),
});

export type DeleteFoodInput = z.infer<typeof deleteFoodSchema>;
