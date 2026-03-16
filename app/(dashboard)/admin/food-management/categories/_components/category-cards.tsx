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
      onError: (error) => {
        toast.error(error.message || 'Failed to delete category.');
      },
    })
  );

  const handleEdit = (id: number) => {
    openEditCategoryDialog(id);
  };

  const handleDelete = ({ name, id }: { name: string; id: number }) => {
    alert({
      title: `Delete category ${name}?`,
      description: 'Are you sure you want to delete this category? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm: () => deleteCategory({ id }),
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => `skeleton-${i}`).map((key) => (
          <CardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError isRefetching={isRefetching} refetchAction={refetch} />;
  }

  if (!data.length) {
    return <NoItemFound onClick={() => openCreateCategoryDialog()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data.map((category) => (
        <div
          className="flex flex-col justify-between gap-3 rounded-lg border p-6"
          key={category.id}
        >
          <p className="truncate font-medium">{category.name}</p>

          <div className="flex items-center gap-1">
            <Button
              aria-label={`Edit ${category.name}`}
              className="size-6"
              onClick={() => handleEdit(category.id)}
              size="icon"
              title={`Edit ${category.name}`}
              type="button"
              variant="ghost"
            >
              <Edit />
            </Button>
            <Button
              aria-disabled={isPending}
              aria-label={`Delete ${category.name}`}
              className="size-6"
              disabled={isPending}
              onClick={() => handleDelete(category)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
