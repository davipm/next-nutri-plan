import type { CreateMealInput } from '@/server/modules/meal/meal.schema';

export function getDefaultMealFormValues(): CreateMealInput {
  return {
    dateTime: new Date(),
    mealFoods: [],
  };
}
