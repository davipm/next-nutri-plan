'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CirclePlus, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { CategoryFormDialog } from '@/app/(dashboard)/admin/food-management/categories/_components/category-form-dialog';
import { FoodServingUnit } from '@/app/(dashboard)/admin/food-management/foods/_components/food-serving-unit';
import { ALL_CATEGORIES_VALUE } from '@/app/(dashboard)/admin/food-management/foods/_utils/utils';
import { ServingUnitFormDialog } from '@/app/(dashboard)/admin/food-management/serving-units/_components/serving-unit-form-dialog';
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

type FoodFormValues = z.input<typeof baseFoodSchema>;
type FoodFormSubmitValues = z.infer<typeof baseFoodSchema>;

const defaultValues: FoodFormValues = {
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

  const form = useForm<FoodFormValues, unknown, FoodFormSubmitValues>({
    resolver: zodResolver(baseFoodSchema),
    defaultValues,
  });

  const { append } = useFieldArray({
    control: form.control,
    name: 'foodServingUnits',
    keyName: 'id',
  });

  const { reset } = form;

  const { data: categories = [] } = useQuery(orpc.categories.list.queryOptions());
  const { data: servingUnits = [] } = useQuery(orpc.servingUnits.list.queryOptions());

  const { data: foodToEdit } = useQuery(
    orpc.foods.find.queryOptions({
      input: { id: selectedId! },
      enabled: !!selectedId,
    })
  );

  const invalidateFoods = () =>
    queryClient.invalidateQueries({ queryKey: orpc.foods.key({ type: 'query' }) });

  const { mutate: createFoodMutation, isPending: createIsPending } = useMutation(
    orpc.foods.create.mutationOptions({
      onSuccess: async () => {
        closeFoodDialog();
        await invalidateFoods();
      },
    })
  );

  const { mutate: updateFoodMutation, isPending: updateIsPending } = useMutation(
    orpc.foods.update.mutationOptions({
      onSuccess: async () => {
        closeFoodDialog();
        await invalidateFoods();
      },
    })
  );

  const isPending = createIsPending || updateIsPending;
  const isEditLoading = open && isEditMode && (!foodToEdit || foodToEdit.id !== selectedId);

  useEffect(() => {
    if (!(open && isEditMode)) {
      reset(defaultValues);
      return;
    }

    if (foodToEdit && foodToEdit.id === selectedId) {
      reset({
        name: foodToEdit.name,
        categoryId: foodToEdit.categoryId,
        calories: foodToEdit.calories ?? 0,
        carbohydrates: foodToEdit.carbohydrates ?? 0,
        fat: foodToEdit.fat ?? 0,
        fiber: foodToEdit.fiber ?? 0,
        protein: foodToEdit.protein ?? 0,
        sugar: foodToEdit.sugar ?? 0,
        foodServingUnits: foodToEdit.foodServingUnits.map((su) => ({
          servingUnitId: su.servingUnitId,
          grams: su.grams ?? 0,
        })),
      });
    }
  }, [open, isEditMode, selectedId, foodToEdit, reset]);

  const onDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      openFoodDialog();
    } else {
      closeFoodDialog();
    }
  };

  const onSubmit: SubmitHandler<FoodFormSubmitValues> = (data) => {
    if (isEditMode) {
      updateFoodMutation({ id: selectedId, ...data });
    } else {
      createFoodMutation(data);
    }
  };

  const foodServingUnitsValues = form.watch('foodServingUnits') ?? [];
  const selectedServingUnitIds = new Set(
    foodServingUnitsValues
      .map((unit) => unit.servingUnitId)
      .filter((id): id is number => typeof id === 'number' && id > 0)
  );

  const handleAddServingUnit = () => {
    const currentUnits = form.getValues('foodServingUnits');
    const usedIds = new Set(currentUnits.map((unit) => unit.servingUnitId).filter((id) => id > 0));
    const nextServingUnitId = servingUnits.find((unit) => !usedIds.has(unit.id))?.id ?? 0;

    append({
      servingUnitId: nextServingUnitId,
      grams: 0,
    });
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
                      <SelectTrigger aria-invalid={fieldState.invalid} id="categoryId">
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

            {nutritionalFields.map((nutritionalField) => {
              const fieldName = nutritionalField.name as NutritionalFieldName;
              return (
                <FieldGroup key={nutritionalField.name}>
                  <Controller
                    control={form.control}
                    name={fieldName}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          aria-invalid={fieldState.invalid}
                          id={nutritionalField.name}
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : Number(e.target.value)
                            )
                          }
                          placeholder={nutritionalField.placeholder}
                          ref={field.ref}
                          type={nutritionalField.type}
                          value={field.value ?? ''}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              );
            })}

            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-md p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">Serving Units</h3>
                    <ServingUnitFormDialog smallTrigger />
                  </div>
                  <Button
                    className="flex items-center gap-1"
                    disabled={isPending || isEditLoading}
                    onClick={handleAddServingUnit}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <CirclePlus className="size-4" /> Add Serving Unit
                  </Button>
                </div>

                <FoodServingUnit
                  control={form.control}
                  foodServingUnitsValues={foodServingUnitsValues}
                  isEditLoading={isEditLoading}
                  isPending={isPending}
                  selectedServingUnitIds={selectedServingUnitIds}
                  servingUnits={servingUnits}
                />

                {form.formState.errors.foodServingUnits && (
                  <FieldError errors={[form.formState.errors.foodServingUnits]} />
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isPending || isEditLoading} type="submit">
              {isEditMode ? 'Save changes' : 'Create food'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
