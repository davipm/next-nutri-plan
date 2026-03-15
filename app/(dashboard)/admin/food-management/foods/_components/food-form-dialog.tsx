'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CirclePlus, Plus, UtensilsCrossed } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { CategoryFormDialog } from '@/app/(dashboard)/admin/food-management/categories/_components/category-form-dialog';
import { ALL_CATEGORIES_VALUE } from '@/app/(dashboard)/admin/food-management/foods/_utils/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { nutritionalFields } from '@/lib/constants';
import { orpc } from '@/lib/orpc';
import { type BaseFoodSchema, baseFoodSchema } from '@/server/modules/food/food.schema';
import { closeFoodDialog, openFoodDialog, useFoodDialogState } from '@/store/use-food-store';

const defaultValues: BaseFoodSchema = {
  foodServingUnits: [],
  name: '',
  categoryId: null,
  calories: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  protein: 0,
  sugar: 0,
};

type NutritionalFieldName = Extract<
  keyof BaseFoodSchema,
  'calories' | 'carbohydrates' | 'fat' | 'fiber' | 'protein' | 'sugar'
>;

export function FoodFormDialog() {
  const queryClient = useQueryClient();
  const { open, selectedId } = useFoodDialogState();

  const isEditMode = !!selectedId;

  const form = useForm({
    resolver: zodResolver(baseFoodSchema),
    defaultValues,
  });

  const { data: categories = [] } = useQuery(orpc.categories.list.queryOptions());

  const { data: foodToEdit } = useQuery(
    orpc.foods.find.queryOptions({
      input: { id: selectedId! },
      enabled: !!selectedId,
    })
  );

  const { mutate: createFoodMutation, isPending: createIsPending } = useMutation(
    orpc.foods.create.mutationOptions({
      onSuccess: async () => {
        closeFoodDialog();
        await queryClient.invalidateQueries({ queryKey: orpc.foods.key({ type: 'query' }) });
      },
    })
  );

  const { mutate: updateFoodMutation, isPending: updateIsPending } = useMutation(
    orpc.foods.update.mutationOptions({
      onSuccess: async () => {
        closeFoodDialog();
        await queryClient.invalidateQueries({ queryKey: orpc.foods.key({ type: 'query' }) });
      },
    })
  );

  const isPending = createIsPending || updateIsPending;

  useEffect(() => {
    if (isEditMode && foodToEdit) {
      form.reset({
        name: foodToEdit.name,
        categoryId: foodToEdit.categoryId,
        calories: foodToEdit.calories ?? 0,
        carbohydrates: foodToEdit.carbohydrates ?? 0,
        fat: foodToEdit.fat ?? 0,
        fiber: foodToEdit.fiber ?? 0,
        protein: foodToEdit.protein ?? 0,
        sugar: foodToEdit.sugar ?? 0,
        foodServingUnits: foodToEdit.foodServingUnits.map((servingUnit) => ({
          servingUnitId: servingUnit.servingUnitId,
          grams: servingUnit.grams ?? 0,
        })),
      });
    } else if (!isEditMode) {
      form.reset(defaultValues);
    }
  }, [isEditMode, foodToEdit, form]);

  const onDialogOpenChange = () => {
    openFoodDialog();

    if (open) {
      closeFoodDialog();
      form.reset(defaultValues);
    }
  };

  const onSubmit: SubmitHandler<BaseFoodSchema> = (data) => {
    if (isEditMode) {
      updateFoodMutation({ id: selectedId, ...data });
    } else {
      createFoodMutation(data);
    }
  };

  return (
    <Dialog onOpenChange={onDialogOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> Create Food
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-between pr-3">
          <DialogTitle>{isEditMode ? 'Edit Food' : 'Create a New Food'}</DialogTitle>
          <CategoryFormDialog smallTrigger />
        </DialogHeader>
        <form className="space-y-6" id="food-form-dialog" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup className="col-span-1 grid">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      placeholder="Enter food name"
                      type="text"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="col-span-1 grid">
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Select
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(value === ALL_CATEGORIES_VALUE ? null : Number(value))
                      }
                      value={field.value ? String(field.value) : ALL_CATEGORIES_VALUE}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid} id="food-category-filter">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          <SelectItem value={ALL_CATEGORIES_VALUE}>All categories</SelectItem>
                          {!!categories.length && <SelectSeparator />}
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            {nutritionalFields.map((field) => {
              const fieldName = field.name as NutritionalFieldName;

              return (
                <FieldGroup key={field.name}>
                  <Field data-invalid={!!form.formState.errors[fieldName]}>
                    <Input
                      aria-invalid={!!form.formState.errors[fieldName]}
                      id={field.name}
                      placeholder={field.placeholder}
                      type={field.type}
                      {...form.register(fieldName, {
                        setValueAs: (value) => (value === '' ? 0 : Number(value)),
                      })}
                    />
                    {form.formState.errors[fieldName] && (
                      <FieldError errors={[form.formState.errors[fieldName]]} />
                    )}
                  </Field>
                </FieldGroup>
              );
            })}

            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Serving Units</h3>
                  <Button
                    className="flex items-center gap-1"
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <CirclePlus className="size-4" /> Add Serving Unit
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center text-muted-foreground">
                  <UtensilsCrossed className="mb-2 size-10 opacity-50" />
                  <p>No serving units added yet</p>
                  <p className="text-sm">Add serving units to help users measure this food</p>
                </div>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isPending} form="food-form-dialog" type="submit">
            {isEditMode ? 'Save changes' : 'Create food'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
