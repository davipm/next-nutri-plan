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
  closeCategoryDialog,
  openCreateCategoryDialog,
  useCategoryDialogState,
} from '@/store/use-categories-store';

interface Props {
  smallTrigger?: boolean;
}

const categorySchema = z.object({
  name: z.string().min(1).max(255),
});

type CategorySchema = z.infer<typeof categorySchema>;

export function CategoryFormDialog({ smallTrigger = false }: Props) {
  const queryClient = useQueryClient();
  const { open, selectedId } = useCategoryDialogState();

  const isEditMode = !!selectedId;

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  const { data: categoryToEdit } = useQuery(
    orpc.categories.find.queryOptions({
      input: { id: selectedId! },
      enabled: !!selectedId,
    })
  );

  const { mutate: createCategoryMutation, isPending: createIsPending } = useMutation(
    orpc.categories.create.mutationOptions({
      onSuccess: async () => {
        closeCategoryDialog();
        await queryClient.invalidateQueries({ queryKey: orpc.categories.key({ type: 'query' }) });
      },
    })
  );

  const { mutate: updateCategoryMutation, isPending: updateIsPending } = useMutation(
    orpc.categories.update.mutationOptions({
      onSuccess: async () => {
        closeCategoryDialog();
        await queryClient.invalidateQueries({ queryKey: orpc.categories.key({ type: 'query' }) });
      },
    })
  );

  const isPending = createIsPending || updateIsPending;

  useEffect(() => {
    if (isEditMode && categoryToEdit) {
      form.setValue('name', categoryToEdit.name);
    } else if (!isEditMode) {
      form.reset();
    }
  }, [isEditMode, categoryToEdit, form]);

  const handleDialogOpenChange = () => {
    openCreateCategoryDialog();

    if (open) {
      closeCategoryDialog();
      form.reset();
    }
  };

  const onSubmit: SubmitHandler<CategorySchema> = (data) => {
    if (isEditMode) {
      updateCategoryMutation({ id: selectedId, ...data });
    } else {
      createCategoryMutation(data);
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
            New Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Edit Category' : 'New Category'}
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
                    placeholder="Name"
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
              {isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
