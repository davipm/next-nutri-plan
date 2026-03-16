import { MealCards } from '@/app/(dashboard)/client/_components/meal-cards';
import { MealFilters } from '@/app/(dashboard)/client/_components/meal-filters';
import { MealFormDialog } from '@/app/(dashboard)/client/_components/meal-form-dialog';

export default function Page() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <MealFilters />
        <MealFormDialog />
      </div>
      <MealCards />
    </>
  );
}
