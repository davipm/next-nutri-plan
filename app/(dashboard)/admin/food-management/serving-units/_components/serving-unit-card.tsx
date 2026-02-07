'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { orpc } from '@/lib/orpc';
import { alert } from '@/store/use-global-store';
import { openEditServingUnitDialog } from '@/store/use-serving-unit-store';

interface Props {
  id: number;
  name: string;
}

export function ServingUnitCard({ name, id }: Props) {
  const queryClient = useQueryClient();

  const { mutate: deleteServingUnit, isPending } = useMutation(
    orpc['serving-units'].delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc['serving-units'].key({ type: 'query' }),
        });
        toast.success('Serving Unit deleted successfully.');
      },
    }),
  );

  const handleEdit = () => {
    openEditServingUnitDialog(id);
  };

  const handleDelete = () => {
    alert({
      title: `Delete Serving unit ${name}?`,
      description: `Are you sure you want to delete this Serving unit? This action cannot be undone.`,
      onConfirm: () => deleteServingUnit({ id }),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <p className="truncate font-medium">{name}</p>

      <div className="flex items-center gap-1">
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleEdit}
          aria-label={`Edit ${name}`}
          title={`Edit ${name}`}
        >
          <Edit />
        </Button>
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${name}`}
          disabled={isPending}
          aria-disabled={isPending}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}
