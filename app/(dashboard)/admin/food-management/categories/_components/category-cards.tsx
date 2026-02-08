'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { CardSkeleton } from '@/components/card-skeleton';
import { HasError } from '@/components/has-error';
import { NoItemFound } from '@/components/no-item-found';
import { Button } from '@/components/ui/button';
import { orpc } from '@/lib/orpc';
import { openCreateCategoryDialog, openEditCategoryDialog } from '@/store/use-categories-store';
import { alert } from '@/store/use-global-store';

export function CategoryCards() {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery(orpc.categories.list.queryOptions());

  const { mutate: deleteCategory, isPending } = useMutation(
    orpc.categories.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.categories.key({ type: 'query' }) });
        toast.success('Category deleted successfully.');
      },
    }),
  );

  const handleEdit = (id: number) => {
    openEditCategoryDialog(id);
  };

  const handleDelete = ({ name, id }: { name: string; id: number }) => {
    alert({
      title: `Delete category ${name}?`,
      description: `Are you sure you want to delete this category? This action cannot be undone.`,
      onConfirm: () => deleteCategory({ id }),
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError refetchAction={refetch} isRefetching={isRefetching} />;
  }

  if (!data.length) {
    return <NoItemFound onClick={() => openCreateCategoryDialog()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data.map((category) => (
        <div
          key={category.id}
          className="flex flex-col justify-between gap-3 rounded-lg border p-6"
        >
          <p className="truncate font-medium">{category.name}</p>

          <div className="flex items-center gap-1">
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => handleEdit(category.id)}
              aria-label={`Edit ${category.name}`}
              title={`Edit ${category.name}`}
            >
              <Edit />
            </Button>
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => handleDelete(category)}
              aria-label={`Delete ${category.name}`}
              disabled={isPending}
              aria-disabled={isPending}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
