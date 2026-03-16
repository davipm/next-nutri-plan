'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, CirclePlus, Loader2Icon, Plus, Trash2, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';
import { useFoodFilters } from '@/store/use-food-store';
import { closeMealDialog, openMealDialog, useMealDialogState } from '@/store/use-meal-store';
import { closeServingUnitDialog } from '@/store/use-serving-unit-store';

function formatDate(date: Date) {
  return format(date, 'EEEE, MMMM dd, yyyy');
}

interface Props {
  smallTrigger?: boolean;
}

const mealSchema = z.object({
  userId: z.string(),
  dateTime: z.date(),
  mealFoods: z.array(
    z.object({
      foodId: z.string(),
      quantity: z.number(),
    })
  ),
});

type MealSchema = z.infer<typeof mealSchema>;

export function MealFormDialog({ smallTrigger }: Props) {
  const queryClient = useQueryClient();
  const { open, selectedId } = useMealDialogState();
  const foodFilters = useFoodFilters();

  const isEditMode = !!selectedId;

  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      mealFoods: [],
      userId: '',
      dateTime: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'mealFoods' });

  const { data: foods } = useQuery(orpc.foods.list.queryOptions({ input: foodFilters }));

  const { data: mealToEdit } = useQuery(
    orpc.meals.find.queryOptions({
      input: { id: selectedId! },
      enabled: !!selectedId,
    })
  );

  const { mutate: createMealsMutation, isPending: createIsPending } = useMutation(
    orpc.meals.create.mutationOptions({
      onSuccess: async () => {
        closeServingUnitDialog();
        await queryClient.invalidateQueries({
          queryKey: orpc.meals.key({ type: 'query' }),
        });
      },
    })
  );

  const { mutate: updateMealsMutation, isPending: updateIsPending } = useMutation(
    orpc.meals.update.mutationOptions({
      onSuccess: async () => {
        closeServingUnitDialog();
        await queryClient.invalidateQueries({
          queryKey: orpc.meals.key({ type: 'query' }),
        });
      },
    })
  );

  const isPending = createIsPending || updateIsPending;

  const foodOptions = foods?.data.map((food) => ({
    label: food.name,
    value: food.id,
  }));

  useEffect(() => {
    if (isEditMode && mealToEdit) {
      form.setValue('dateTime', mealToEdit.dateTime);
    }
  }, [isEditMode, mealToEdit, form.setValue]);

  const handleMealOpenChange = () => {
    openMealDialog();

    if (open) {
      closeMealDialog();
      form.reset();
    }
  };

  const onSubmit: SubmitHandler<MealSchema> = (data) => {
    console.log({ data });
  };

  return (
    <Dialog onOpenChange={handleMealOpenChange} open={open}>
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
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Edit Meal' : 'Add New Meal'}
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Foods</h3>
                  <Button
                    className="flex items-center gap-1"
                    onClick={() =>
                      append({
                        foodId: '',
                        servingUnitId: '',
                        amount: '0',
                      })
                    }
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <CirclePlus className="size-4" /> Add Food
                  </Button>
                </div>

                {fields.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center text-muted-foreground">
                    <UtensilsCrossed className="mb-2 size-10 opacity-50" />
                    <p>No foods added to this meal yet</p>
                    <p className="text-sm">
                      Add foods to track what you&apos;re eating in this meal
                    </p>
                  </div>
                )}

                {fields.map((field, index) => (
                  <div
                    className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3"
                    key={field.foodId}
                  >
                    <FieldGroup className="col-span-1 flex items-end">
                      <Controller
                        control={form.control}
                        name={`mealFoods.${index}.foodId`}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Select
                              name={field.name}
                              onValueChange={(value) => field.onChange(Number(value))}
                              value={field.value ? String(field.value) : undefined}
                            >
                              <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
                                <SelectValue placeholder="Select a serving unit..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Serving Units</SelectLabel>
                                  {/*{servingUnits.length === 0 ? (*/}
                                  {/*  <SelectItem disabled value="__empty__">*/}
                                  {/*    No serving units found*/}
                                  {/*  </SelectItem>*/}
                                  {/*) : (*/}
                                  {/*  servingUnits.map((units) => {*/}
                                  {/*    const currentServingUnitId =*/}
                                  {/*      foodServingUnitsValues[index]?.servingUnitId ?? 0;*/}
                                  {/*    const isAlreadySelectedElsewhere =*/}
                                  {/*      selectedServingUnitIds.has(units.id) &&*/}
                                  {/*      units.id !== currentServingUnitId;*/}

                                  {/*    return (*/}
                                  {/*      <SelectItem*/}
                                  {/*        disabled={isAlreadySelectedElsewhere}*/}
                                  {/*        key={units.id}*/}
                                  {/*        value={String(units.id)}*/}
                                  {/*      >*/}
                                  {/*        {units.name}*/}
                                  {/*      </SelectItem>*/}
                                  {/*    );*/}
                                  {/*  })*/}
                                  {/*)}*/}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </FieldGroup>

                    <Button className="mt-3" size="icon" type="button" variant="outline">
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

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
                              {field.value ? formatDate(field.value) : 'Filter by date'}
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
          </div>

          <DialogFooter>
            <Button disabled={isPending} type="submit">
              {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {isEditMode ? 'Update meal' : 'Create meal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
