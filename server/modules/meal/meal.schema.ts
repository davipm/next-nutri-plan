import { z } from 'zod';

export const foodModelSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  calories: z.number().nullable(),
  protein: z.number().nullable(),
  fat: z.number().nullable(),
  carbohydrates: z.number().nullable(),
  fiber: z.number().nullable(),
  sugar: z.number().nullable(),
  categoryId: z.number().nullable(),
  createdAt: z.date(),
  updateAt: z.date(),
  mealId: z.number().nullable(),
});

export const servingUnitModelSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  foodId: z.number().nullable(),
  createdAt: z.date(),
  updateAt: z.date(),
});

export const mealFoodSchema = z.object({
  id: z.number().min(1),
  foodId: z.number().min(1),
  mealId: z.number().min(1),
  amount: z.number().positive('Amount must be greater than 0'),
  createdAt: z.date(),
  updatedAt: z.date(),
  servingUnitId: z.number().min(1),
});

export const mealSchema = z.object({
  id: z.number().min(1),
  dateTime: z.date(),
  userId: z.string().nullable(),
  createdAt: z.date(),
  updateAt: z.date(),
});

export const mealFoodWithRelationsSchema = mealFoodSchema.extend({
  food: foodModelSchema,
  servingUnit: servingUnitModelSchema,
});

export const mealWithRelationsSchema = mealSchema.extend({
  mealFoods: z.array(mealFoodWithRelationsSchema),
});

export const mealFoodInputSchema = z.object({
  foodId: z.number().min(1, 'Food ID must be positive'),
  servingUnitId: z.number().min(1, 'Serving unit ID must be positive'),
  amount: z.number().positive('Amount must be greater than 0'),
});

export const baseMealSchema = z.object({
  dateTime: z.coerce.date(),
  mealFoods: z.array(mealFoodInputSchema).optional().default([]),
});

export const mealFiltersSchema = z.object({
  dateTime: z.coerce.date().optional(),
});

export const findMealSchema = z.object({
  id: z.number().min(1, 'Meal ID must be positive'),
});

export const createMealSchema = baseMealSchema;

export const updateMealSchema = baseMealSchema.extend({
  id: z.number().min(1, 'Meal ID must be positive'),
});

export const deleteMealSchema = z.object({
  id: z.number().min(1, 'Meal ID must be positive'),
});

export type FoodModel = z.infer<typeof foodModelSchema>;
export type ServingUnitModel = z.infer<typeof servingUnitModelSchema>;
export type MealFood = z.infer<typeof mealFoodSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type MealFoodWithRelations = z.infer<typeof mealFoodWithRelationsSchema>;
export type MealWithRelations = z.infer<typeof mealWithRelationsSchema>;
export type MealFoodInput = z.infer<typeof mealFoodInputSchema>;
export type BaseMealInput = z.infer<typeof baseMealSchema>;
export type MealFiltersInput = z.infer<typeof mealFiltersSchema>;
export type FindMealInput = z.infer<typeof findMealSchema>;
export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateMealInput = z.infer<typeof updateMealSchema>;
export type DeleteMealInput = z.infer<typeof deleteMealSchema>;
