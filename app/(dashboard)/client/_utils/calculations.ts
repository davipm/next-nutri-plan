import type { MealFoodWithRelations } from '@/server/modules/meal/meal.schema';

type NutritionFood = Pick<
  MealFoodWithRelations['food'],
  'calories' | 'protein' | 'carbohydrates' | 'fat' | 'sugar' | 'fiber'
>;

export type MealFoodWithFood = Pick<MealFoodWithRelations, 'amount'> & {
  food: NutritionFood;
};

export interface MealWithFoods {
  mealFoods: MealFoodWithFood[];
}

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

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const standardNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

export const formatNutritionStat = (value: number, unit: string) => {
  const normalizedValue = Number.isFinite(value) ? value : 0;
  const formatter =
    Math.abs(normalizedValue) >= 1000 ? compactNumberFormatter : standardNumberFormatter;

  return `${formatter.format(normalizedValue)} ${unit}`;
};
