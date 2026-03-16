import { CategoryCards } from '@/app/(dashboard)/admin/food-management/categories/_components/category-cards';
import { CategoryFormDialog } from '@/app/(dashboard)/admin/food-management/categories/_components/category-form-dialog';

export default function CategoriesPage() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-semibold text-3xl">Categories List</h1>
        <CategoryFormDialog />
      </div>
      <CategoryCards />
    </>
  );
}
