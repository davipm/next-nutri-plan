'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Flame } from 'lucide-react';
import { calculateNutritionTotal } from '@/app/(dashboard)/client/_utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orpc } from '@/lib/orpc';
import { useMealFilters } from '@/store/use-meal-store';

export function MealCards() {
  const mealFilters = useMealFilters();

  const { data: meals = [] } = useQuery(
    orpc.meals.list.queryOptions({ input: { date: mealFilters.dateTime } })
  );

  const displayDate = mealFilters.dateTime
    ? format(mealFilters.dateTime, 'EEEE, MMMM dd, yyyy')
    : 'Today';

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
                {calculateNutritionTotal(meals).calories} kcal
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
