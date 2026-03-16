'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { orpc } from '@/lib/orpc';
import {
  closeServingUnitDialog,
  openCreateServingUnitDialog,
  useServingUnitDialogState,
} from '@/store/use-serving-unit-store';

interface Props {
  smallTrigger?: boolean;
}

const servingUnitSchema = z.object({
  name: z.string().min(1).max(255),
});

type ServingUnitSchema = z.infer<typeof servingUnitSchema>;

export function ServingUnitFormDialog({ smallTrigger }: Props) {
  const queryClient = useQueryClient();
  const { open, selectedId } = useServingUnitDialogState();

  const isEditMode = !!selectedId;

  const { data: servingUnitToEdit } = useQuery(
    orpc.servingUnits.find.queryOptions({
      input: { id: selectedId! },
      enabled: !!selectedId,
    })
  );

  const { mutate: createServingUnitMutation, isPending: createIsPending } = useMutation(
    orpc.servingUnits.create.mutationOptions({
      onSuccess: async () => {
        closeServingUnitDialog();
        await queryClient.invalidateQueries({
          queryKey: orpc.servingUnits.key({ type: 'query' }),
        });
      },
    })
  );

  const { mutate: updateServingUnitMutation, isPending: updateIsPending } = useMutation(
    orpc.servingUnits.update.mutationOptions({
      onSuccess: async () => {
        closeServingUnitDialog();
        await queryClient.invalidateQueries({
          queryKey: orpc.servingUnits.key({ type: 'query' }),
        });
      },
    })
  );

  const isPending = createIsPending || updateIsPending;

  const form = useForm({
    resolver: zodResolver(servingUnitSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (!(open && isEditMode)) {
      form.reset();
      return;
    }

    if (servingUnitToEdit && servingUnitToEdit.id === selectedId) {
      form.setValue('name', servingUnitToEdit.name);
    }
  }, [isEditMode, servingUnitToEdit, form, open, selectedId]);

  const handleDialogOpenChange = () => {
    openCreateServingUnitDialog();

    if (open) {
      closeServingUnitDialog();
      form.reset();
    }
  };

  const onSubmit: SubmitHandler<ServingUnitSchema> = (data) => {
    if (isEditMode) {
      updateServingUnitMutation({ id: selectedId, ...data });
    } else {
      createServingUnitMutation(data);
    }
  };

  return (
    <Dialog onOpenChange={handleDialogOpenChange} open={open}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" type="button" variant="ghost">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            New Serving Unit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Edit Serving Unit' : 'Create a New Serving Unit'}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                    placeholder="Enter serving unit name"
                    type="text"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button disabled={isPending} type="submit">
              {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {isEditMode ? 'Update serving unit' : 'Create serving unit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
