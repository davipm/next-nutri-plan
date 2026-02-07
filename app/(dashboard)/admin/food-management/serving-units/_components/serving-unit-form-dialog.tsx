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
  useSelectedServingUnitId,
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
  const { open } = useServingUnitDialogState();
  const selectedId = useSelectedServingUnitId()!;

  const isEditMode = !!selectedId;

  const { data: servingUnitToEdit } = useQuery(
    orpc['serving-units'].find.queryOptions({
      input: { id: selectedId },
      enabled: !!selectedId,
    }),
  );

  const { mutate: createServingUnitMutation, isPending: createIsPending } = useMutation(
    orpc['serving-units'].create.mutationOptions({
      onSuccess: async () => {
        closeServingUnitDialog();
        await queryClient.invalidateQueries({
          queryKey: orpc['serving-units'].key({ type: 'query' }),
        });
      },
    }),
  );

  const { mutate: updateServingUnitMutation, isPending: updateIsPending } = useMutation(
    orpc['serving-units'].update.mutationOptions({
      onSuccess: async () => {
        closeServingUnitDialog();
        await queryClient.invalidateQueries({
          queryKey: orpc['serving-units'].key({ type: 'query' }),
        });
      },
    }),
  );

  const isPending = createIsPending || updateIsPending;

  const form = useForm({
    resolver: zodResolver(servingUnitSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (isEditMode && servingUnitToEdit) {
      form.setValue('name', servingUnitToEdit.name);
    } else if (!isEditMode) {
      form.reset();
    }
  }, [isEditMode, servingUnitToEdit, form]);

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
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Enter serving unit name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {isEditMode ? 'Update serving unit' : 'Create serving unit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
