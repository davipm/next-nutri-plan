'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, CirclePlus, Loader2Icon, Plus, UtensilsCrossed, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';
import { type CreateMealInput, mealFoodInputSchema } from '@/server/modules/meal/meal.schema';
import { closeMealDialog, openMealDialog, useMealDialogState } from '@/store/use-meal-store';

function formatDate(date: Date) {
  return format(date, 'EEEE, MMMM dd, yyyy');
}

const mealFormSchema = z.object({
  dateTime: z.date(),
  mealFoods: z.array(mealFoodInputSchema),
});

function getDefaultMealFormValues(): CreateMealInput {
  return {
    dateTime: new Date(),
    mealFoods: [],
  };
}

interface Props {
  smallTrigger?: boolean;
}

export function MealFormDialog({ smallTrigger }: Props) {
  const queryClient = useQueryClient();
  const { open, selectedId } = useMealDialogState();

  const isEditMode = selectedId !== null;

  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<CreateMealInput>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: getDefaultMealFormValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'mealFoods',
  });

  const mealFoodsValues =
    useWatch({
      control: form.control,
      name: 'mealFoods',
    }) ?? [];

  const { data: foodsResponse } = useQuery(
    orpc.foods.list.queryOptions({
      input: {
        page: 1,
        pageSize: 100,
        sortBy: 'name',
        sortOrder: 'asc',
      },
    })
  );

  const { data: mealToEdit, isLoading: isEditLoading } = useQuery(
    orpc.meals.find.queryOptions({
      input: { id: selectedId ?? 0 },
      enabled: open && isEditMode,
    })
  );

  const { mutate: createMealMutation, isPending: createIsPending } = useMutation(
    orpc.meals.create.mutationOptions({
      onSuccess: async () => {
        closeMealDialog();
        form.reset(getDefaultMealFormValues());
        toast.success('Meal created successfully.');
        await queryClient.invalidateQueries({
          queryKey: orpc.meals.key({ type: 'query' }),
        });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create meal.');
      },
    })
  );

  const { mutate: updateMealMutation, isPending: updateIsPending } = useMutation(
    orpc.meals.update.mutationOptions({
      onSuccess: async () => {
        closeMealDialog();
        form.reset(getDefaultMealFormValues());
        toast.success('Meal updated successfully.');
        await queryClient.invalidateQueries({
          queryKey: orpc.meals.key({ type: 'query' }),
        });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update meal.');
      },
    })
  );

  const isPending = createIsPending || updateIsPending;
  const foods = foodsResponse?.data ?? [];
  const foodsById = new Map(foods.map((food) => [food.id, food]));

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!isEditMode) {
      form.reset(getDefaultMealFormValues());
      return;
    }

    if (mealToEdit && mealToEdit.id === selectedId) {
      form.reset({
        dateTime: mealToEdit.dateTime,
        mealFoods: mealToEdit.mealFoods.map((mealFood) => ({
          foodId: mealFood.foodId,
          servingUnitId: mealFood.servingUnitId,
          amount: mealFood.amount,
        })),
      });
    }
  }, [form, isEditMode, mealToEdit, open, selectedId]);

  const onDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      openMealDialog();
      return;
    }

    closeMealDialog();
    form.reset(getDefaultMealFormValues());
  };

  const handleAddFood = () => {
    append({
      foodId: 0,
      servingUnitId: 0,
      amount: 1,
    });
  };

  const handleFoodChange = (index: number, nextFoodIdValue: string) => {
    const nextFoodId = Number(nextFoodIdValue);
    const nextFood = foodsById.get(nextFoodId);
    const currentServingUnitId = form.getValues(`mealFoods.${index}.servingUnitId`);
    const hasCurrentServingUnit = nextFood?.foodServingUnits.some(
      (unit) => unit.servingUnitId === currentServingUnitId
    );

    form.setValue(`mealFoods.${index}.foodId`, nextFoodId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(
      `mealFoods.${index}.servingUnitId`,
      hasCurrentServingUnit
        ? currentServingUnitId
        : (nextFood?.foodServingUnits[0]?.servingUnitId ?? 0),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const onSubmit: SubmitHandler<CreateMealInput> = (data) => {
    if (isEditMode && selectedId !== null) {
      updateMealMutation({ id: selectedId, ...data });
      return;
    }

    createMealMutation(data);
  };

  return (
    <Dialog onOpenChange={onDialogOpenChange} open={open}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" type="button" variant="ghost">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            New Meal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Meal' : 'Create a New Meal'}</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" id="meal-form-dialog" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FieldGroup className="w-full">
                <Controller
                  control={form.control}
                  name="dateTime"
                  render={({ field, fieldState }) => (
                    <Field className="w-full" data-invalid={fieldState.invalid}>
                      <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            aria-invalid={fieldState.invalid}
                            className={cn(
                              'w-full min-w-0 justify-between text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            id="meal-date-filter"
                            type="button"
                            variant="outline"
                          >
                            <span className="flex-1 truncate pr-2">
                              {field.value ? formatDate(field.value) : 'Select a meal date'}
                            </span>
                            <CalendarIcon className="text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
                          <Calendar
                            captionLayout="dropdown"
                            mode="single"
                            month={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              if (date) {
                                setCalendarOpen(false);
                              }
                            }}
                            selected={field.value}
                          />
                          <div className="flex items-center justify-between border-t px-3 py-2">
                            <Button
                              onClick={() => {
                                field.onChange(undefined);
                                setCalendarOpen(false);
                              }}
                              size="sm"
                              type="button"
                              variant="ghost"
                            >
                              Clear
                            </Button>
                            <Button
                              onClick={() => setCalendarOpen(false)}
                              size="sm"
                              type="button"
                              variant="outline"
                            >
                              Done
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-md p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-sm">Foods</h3>
                    <p className="text-muted-foreground text-xs">
                      Pick a food, then choose one of its serving units.
                    </p>
                  </div>
                  <Button
                    className="flex items-center gap-1"
                    disabled={isPending || isEditLoading || foods.length === 0}
                    onClick={handleAddFood}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <CirclePlus className="size-4" /> Add Food
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center text-muted-foreground">
                    <UtensilsCrossed className="mb-2 size-10 opacity-50" />
                    <p>No foods added to this meal yet</p>
                    <p className="text-sm">
                      {foods.length === 0
                        ? 'Create foods with serving units before logging a meal'
                        : 'Add foods to track what you are eating in this meal'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, index) => {
                      const selectedFoodId = mealFoodsValues[index]?.foodId ?? 0;
                      const selectedFood = foodsById.get(selectedFoodId);
                      const availableServingUnits = selectedFood?.foodServingUnits ?? [];
                      let servingUnitItems: ReactNode = (
                        <SelectItem disabled value="__empty__">
                          Select a food first
                        </SelectItem>
                      );

                      if (selectedFood && availableServingUnits.length === 0) {
                        servingUnitItems = (
                          <SelectItem disabled value="__empty__">
                            No serving units found
                          </SelectItem>
                        );
                      } else if (selectedFood) {
                        servingUnitItems = availableServingUnits.map((unit) => (
                          <SelectItem key={unit.servingUnitId} value={String(unit.servingUnitId)}>
                            {unit.servingUnit.name}
                          </SelectItem>
                        ));
                      }

                      return (
                        <div
                          className="grid items-center gap-3 md:grid-cols-[1fr_1fr_1fr_auto]"
                          key={field.id}
                        >
                          <FieldGroup className="col-span-1 flex items-end">
                            <Controller
                              control={form.control}
                              name={`mealFoods.${index}.foodId`}
                              render={({ field: controllerField, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <Select
                                    name={controllerField.name}
                                    onValueChange={(value) => handleFoodChange(index, value)}
                                    value={
                                      controllerField.value > 0
                                        ? String(controllerField.value)
                                        : undefined
                                    }
                                  >
                                    <SelectTrigger
                                      aria-invalid={fieldState.invalid}
                                      id={controllerField.name}
                                    >
                                      <SelectValue placeholder="Select a food" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Foods</SelectLabel>
                                        {foods.length === 0 ? (
                                          <SelectItem disabled value="__empty__">
                                            No foods found
                                          </SelectItem>
                                        ) : (
                                          foods.map((food) => (
                                            <SelectItem key={food.id} value={String(food.id)}>
                                              {food.name}
                                            </SelectItem>
                                          ))
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          <FieldGroup className="col-span-1 flex items-end">
                            <Controller
                              control={form.control}
                              name={`mealFoods.${index}.servingUnitId`}
                              render={({ field: controllerField, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <Select
                                    disabled={!selectedFood || availableServingUnits.length === 0}
                                    name={controllerField.name}
                                    onValueChange={(value) =>
                                      controllerField.onChange(Number(value))
                                    }
                                    value={
                                      controllerField.value > 0
                                        ? String(controllerField.value)
                                        : undefined
                                    }
                                  >
                                    <SelectTrigger
                                      aria-invalid={fieldState.invalid}
                                      id={controllerField.name}
                                    >
                                      <SelectValue
                                        placeholder={
                                          selectedFood
                                            ? 'Select a serving unit'
                                            : 'Select a food first'
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Serving Units</SelectLabel>
                                        {servingUnitItems}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          <FieldGroup className="col-span-1 flex items-end">
                            <Controller
                              control={form.control}
                              name={`mealFoods.${index}.amount`}
                              render={({ field: controllerField, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <Input
                                    aria-invalid={fieldState.invalid}
                                    id={controllerField.name}
                                    inputMode="decimal"
                                    onBlur={controllerField.onBlur}
                                    onChange={(event) => {
                                      controllerField.onChange(
                                        event.target.value === '' ? 0 : Number(event.target.value)
                                      );
                                    }}
                                    placeholder="Amount"
                                    ref={controllerField.ref}
                                    step="any"
                                    type="number"
                                    value={controllerField.value > 0 ? controllerField.value : ''}
                                  />
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          <div className="flex items-center justify-end">
                            <Button
                              aria-label="Remove food row"
                              className="size-9"
                              disabled={isPending || isEditLoading}
                              onClick={() => remove(index)}
                              size="icon"
                              title="Remove row"
                              type="button"
                              variant="ghost"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {form.formState.errors.mealFoods && (
                  <FieldError errors={[form.formState.errors.mealFoods]} />
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isPending || isEditLoading} type="submit">
              {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {isEditMode ? 'Save changes' : 'Create meal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
