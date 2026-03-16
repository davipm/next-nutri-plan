import { FoodCards } from '@/app/(dashboard)/admin/food-management/foods/_components/food-cards';
import { FoodFilterDrawer } from '@/app/(dashboard)/admin/food-management/foods/_components/food-filter-drawer';
import { FoodFormDialog } from '@/app/(dashboard)/admin/food-management/foods/_components/food-form-dialog';

export default function Page() {
  return (
    <div className="space-y-2">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-semibold text-3xl">Foods List</h1>
        <FoodFormDialog />
      </div>
      <FoodFilterDrawer />
      <FoodCards />
    </div>
  );
}
