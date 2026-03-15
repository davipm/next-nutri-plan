'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarX, Flame, LineChart, PieChart, Utensils } from 'lucide-react';
import MealCardsSkeleton from '@/app/(dashboard)/client/_components/meal-card-skeleton';
import { calculateNutritionTotal } from '@/app/(dashboard)/client/_utils/calculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orpc } from '@/lib/orpc';
import { useMealFilters } from '@/store/use-meal-store';

export function MealCards() {
  const mealFilters = useMealFilters();

  const { data: meals = [], isLoading } = useQuery(
    orpc.meals.list.queryOptions({ input: { date: mealFilters.dateTime } })
  );

  const displayDate = mealFilters.dateTime
    ? format(mealFilters.dateTime, 'EEEE, MMMM dd, yyyy')
    : 'Today';

  const nutritionTotal = calculateNutritionTotal(meals);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 font-bold text-2xl">{displayDate}</h2>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-medium text-sm">
                <Flame className="mr-2 h-4 w-4 text-primary" />
                Total Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{nutritionTotal.calories} kcal</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-medium text-sm">
                <PieChart className="mr-2 h-4 w-4 text-primary" />
                Macronutrients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-muted-foreground text-sm">Protein</p>
                  <p className="font-medium">{nutritionTotal.protein}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Carbs</p>
                  <p className="font-medium">{nutritionTotal.carbs}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Fat</p>
                  <p className="font-medium">{nutritionTotal.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-medium text-sm">
                <Utensils className="mr-2 h-4 w-4 text-primary" />
                Meal Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="spcae-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total Meals</span>
                  <span className="font-medium">{meals.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Food Items</span>
                  <span className="font-medium">
                    {meals.reduce((total, meal) => total + meal.mealFoods.length, 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Meal</span>
                  <span className="font-medium">
                    {meals.length ? format(new Date(meals[0].dateTime), 'h:mm a') : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-medium text-sm">
                <LineChart className="mr-2 h-4 w-4 text-primary" />
                Additional Nutrients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-muted-foreground text-xs">Fiber</p>
                  <p className="font-medium">{nutritionTotal.fiber}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Sugar</p>
                  <p className="font-medium">{nutritionTotal.sugar}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb4 font-medium text-lg">Meals</h3>

        {meals.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarX className="mb-2 text-primary" />
            <h3 className="font-medium text-lg">No meals found</h3>
            <p className="mt-1 text-foreground/60 text-sm">
              Try adjusting your filters or add new meals
            </p>
            <Button className="mt-4" variant="outline">
              Add new meal
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading &&
            Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
              <MealCardsSkeleton key={key} />
            ))}

          {/*{meals.map((meal) => (*/}
          {/*  <MealCard key={meal.id} {...meal} />*/}
          {/*))}*/}
        </div>
      </div>
    </div>
  );
}
