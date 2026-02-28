'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { CardSkeleton } from '@/components/card-skeleton';
import { HasError } from '@/components/has-error';
import { NoItemFound } from '@/components/no-item-found';
import { Button } from '@/components/ui/button';
import { orpc } from '@/lib/orpc';
import { alert } from '@/store/use-global-store';
import {
  openCreateServingUnitDialog,
  openEditServingUnitDialog,
} from '@/store/use-serving-unit-store';

export function ServingUnitCards() {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery(orpc.servingUnits.list.queryOptions());

  const { mutate: deleteServingUnit, isPending } = useMutation(
    orpc.servingUnits.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.servingUnits.key({ type: 'query' }),
        });
        toast.success('Serving Unit deleted successfully.');
      },
    })
  );

  const handleEdit = (id: number) => {
    openEditServingUnitDialog(id);
  };

  const handleDelete = ({ name, id }: { name: string; id: number }) => {
    alert({
      title: `Delete Serving unit ${name}?`,
      description:
        'Are you sure you want to delete this Serving unit? This action cannot be undone.',
      onConfirm: () => deleteServingUnit({ id }),
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
    return <NoItemFound onClick={openCreateServingUnitDialog} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data.map((servingUnit) => (
        <div
          className="flex flex-col justify-between gap-3 rounded-lg border p-6"
          key={servingUnit.id}
        >
          <p className="truncate font-medium">{servingUnit.name}</p>

          <div className="flex items-center gap-1">
            <Button
              aria-label={`Edit ${servingUnit.name}`}
              className="size-6"
              onClick={() => handleEdit(servingUnit.id)}
              size="icon"
              title={`Edit ${servingUnit.name}`}
              type="button"
              variant="ghost"
            >
              <Edit />
            </Button>
            <Button
              aria-disabled={isPending}
              aria-label={`Delete ${servingUnit.name}`}
              className="size-6"
              disabled={isPending}
              onClick={() => handleDelete(servingUnit)}
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
