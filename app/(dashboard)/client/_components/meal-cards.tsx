'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarX, Edit, Flame, LineChart, PieChart, Trash, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import MealCardsSkeleton from '@/app/(dashboard)/client/_components/meal-card-skeleton';
import {
  calculateNutritionTotal,
  calculateTotalCalories,
  formatNutritionStat,
} from '@/app/(dashboard)/client/_utils/calculations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { orpc } from '@/lib/orpc';
import { alert } from '@/store/use-global-store';
import { openMealEditDialog, useMealFilters } from '@/store/use-meal-store';

export function MealCards() {
  const queryClient = useQueryClient();

  const mealFilters = useMealFilters();

  const { data: meals = [], isLoading } = useQuery(
    orpc.meals.list.queryOptions({ input: { dateTime: mealFilters.dateTime } })
  );

  const { mutate: deleteMeal } = useMutation(
    orpc.categories.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.meals.key({ type: 'query' }) });
        toast.success('Meal deleted successfully.');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete Meal.');
      },
    })
  );

  const handleEdit = (id: number) => {
    openMealEditDialog(id);
  };

  const handleDelete = (id: number) => {
    alert({
      title: 'Delete Meal?',
      description: 'Are you sure you want to delete this meal? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm: () => deleteMeal({ id }),
    });
  };

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
              <div className="font-bold text-2xl">
                {formatNutritionStat(nutritionTotal.calories, 'kcal')}
              </div>
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
                  <p className="font-medium">{formatNutritionStat(nutritionTotal.protein, 'g')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Carbs</p>
                  <p className="font-medium">{formatNutritionStat(nutritionTotal.carbs, 'g')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Fat</p>
                  <p className="font-medium">{formatNutritionStat(nutritionTotal.fat, 'g')}</p>
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
                  <p className="font-medium">{formatNutritionStat(nutritionTotal.fiber, 'g')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Sugar</p>
                  <p className="font-medium">{formatNutritionStat(nutritionTotal.sugar, 'g')}</p>
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

          {meals.map((meal) => (
            <div
              className="flex flex-col gap-3 rounded-lg border border-border/40 p-6 transition-colors hover:border-border/80"
              key={meal.id}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p>{format(new Date(meal.dateTime), 'PPp')}</p>
                  <Badge className="mt-1" variant="outline">
                    {formatNutritionStat(calculateTotalCalories(meal.mealFoods), 'kcal')}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    className="size-8"
                    onClick={() => handleEdit(meal.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    className="size-8"
                    onClick={() => handleDelete(meal.id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Utensils className="size-4 text-primary" />
                  <p className="font-medium text-foreground/70 text-sm">
                    {meal.mealFoods.length} {meal.mealFoods.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                {meal.mealFoods.length === 0 ? (
                  <p className="text-foreground/60 text-sm italic">No foods added</p>
                ) : (
                  <div className="space-y-3">
                    {meal.mealFoods.map((mealFood) => (
                      <div className="rounded-md bg-muted/40 p-3" key={mealFood.id}>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{mealFood.food.name}</p>
                          <Badge>
                            {formatNutritionStat(
                              (mealFood.food.calories ?? 0) * (mealFood.amount || 1),
                              'kcal'
                            )}
                          </Badge>
                        </div>

                        <div className="mt-2 flex justify-between text-foreground/70 text-sm">
                          <div>
                            <span>Serving: </span>
                            <span className="font-medium">
                              {mealFood.amount > 0 ? mealFood.amount : 'Not specified'}{' '}
                              {mealFood.servingUnit?.name || 'serving'}
                            </span>
                          </div>

                          <div className="space-x-1 text-xs">
                            <span>P: {formatNutritionStat(mealFood.food.protein ?? 0, 'g')}</span>
                            <span>
                              C: {formatNutritionStat(mealFood.food.carbohydrates ?? 0, 'g')}
                            </span>
                            <span>F: {formatNutritionStat(mealFood.food.fat ?? 0, 'g')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
