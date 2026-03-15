import { MealCards } from '@/app/(dashboard)/client/_components/meal-cards';
import { MealFilters } from '@/app/(dashboard)/client/_components/meal-filters';
import { MealFormDialog } from '@/app/(dashboard)/client/_components/meal-form-dialog';

export default function Page() {
  return (
    <>
      <div className="flex justify-between">
        <MealFilters />
        <MealFormDialog />
      </div>
      <MealCards />
    </>
  );
}
