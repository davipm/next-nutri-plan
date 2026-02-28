import { ServingUnitCards } from '@/app/(dashboard)/admin/food-management/serving-units/_components/serving-unit-cards';
import { ServingUnitFormDialog } from '@/app/(dashboard)/admin/food-management/serving-units/_components/serving-unit-form-dialog';

export default function Page() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-semibold text-3xl">Serving Units List</h1>
        <ServingUnitFormDialog />
      </div>
      <ServingUnitCards />
    </>
  );
}
