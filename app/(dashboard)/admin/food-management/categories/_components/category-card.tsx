'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useCategoriesStore } from '@/app/(dashboard)/admin/food-management/categories/_lib/use-categories-store';
import { Button } from '@/components/ui/button';
import { orpc } from '@/lib/orpc';
import { alert } from '@/store/use-global-store';

type Props = {
  id: number;
  name: string;
};

export function CategoryCard({ name, id }: Props) {
  const queryClient = useQueryClient();
  const { setSelectedCategoryId, setCategoryDialogOpen } = useCategoriesStore();

  const { mutate: deleteCategory, isPending } = useMutation(
    orpc.categories.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.categories.key({ type: 'query' }) });
        toast.success('Category deleted successfully.');
      },
    }),
  );

  const handleEdit = () => {
    setSelectedCategoryId(id);
    setCategoryDialogOpen(true);
  };

  const handleDelete = () => {
    alert({
      title: `Delete category ${name}?`,
      description: `Are you sure you want to delete this category? This action cannot be undone.`,
      onConfirm: () => deleteCategory({ id }),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <p className="truncate font-medium">{name}</p>

      <div className="flex items-center gap-1">
        <Button>
          <Edit />
        </Button>
        <Button>
          <Trash />
        </Button>
      </div>
    </div>
  );
}
