import type { Prisma } from '@/prisma/generated/prisma/client';
import type { MealWithRelations } from '@/server/modules/meal/meal.schema';

type MealFoodFromPrisma = Prisma.MealFoodGetPayload<{
  include: {
    food: true;
    servingUnit: true;
  };
}>;

type TransformedMealFood = Omit<MealFoodFromPrisma, 'foodId' | 'servingUnitId'> & {
  foodId: string;
  servingUnitId: string;
};

type TransformedMeal = Omit<MealWithRelations, 'userId' | 'mealFoods'> & {
  userId: string | null;
  mealFoods: TransformedMealFood[];
};

export type MealFoodWithFood = TransformedMealFood;
export type MealWithFoods = TransformedMeal;

export const calculateTotalCalories = (mealFoods: MealFoodWithFood[]) => {
  return mealFoods.reduce((total, mealFood) => {
    return total + (mealFood.food.calories ?? 0) * (mealFood.amount ?? 1);
  }, 0);
};

export const calculateNutritionTotal = (meals: MealWithFoods[]) => {
  return (
    meals.reduce(
      (total, meal) => {
        for (const mealFood of meal.mealFoods) {
          const multiplier = mealFood.amount ?? 1;
          total.calories += (mealFood.food.calories ?? 0) * multiplier;
          total.protein += (mealFood.food.protein ?? 0) * multiplier;
          total.carbs += (mealFood.food.carbohydrates ?? 0) * multiplier;
          total.fat += (mealFood.food.fat ?? 0) * multiplier;
          total.sugar += (mealFood.food.sugar ?? 0) * multiplier;
          total.fiber += (mealFood.food.fiber ?? 0) * multiplier;
        }
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0 }
    ) || { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0 }
  );
};
