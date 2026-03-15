'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { type MealFiltersInput, mealFiltersSchema } from '@/server/modules/meal/meal.schema';
import { useMealFilters } from '@/store/use-meal-store';

export function MealFilters() {
  const mealFilters = useMealFilters();

  const form = useForm({
    defaultValues: mealFilters,
    resolver: zodResolver(mealFiltersSchema),
  });

  const onSubmit: SubmitHandler<MealFiltersInput> = (data) => {
    console.log(data);
  };

  return (
    <form className="mb-4 flex items-center gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="col-span-1 grid">
        {/*<Controller*/}
        {/*  control={form.control}*/}
        {/*  name="dateTime"*/}
        {/*  render={({ field, fieldState }) => (*/}
        {/*    <Field data-invalid={fieldState.invalid}>*/}
        {/*      <Input*/}
        {/*        {...field}*/}
        {/*        aria-invalid={fieldState.invalid}*/}
        {/*        id={field.name}*/}
        {/*        placeholder="Enter food name"*/}
        {/*        type="text"*/}
        {/*      />*/}
        {/*      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}*/}
        {/*    </Field>*/}
        {/*  )}*/}
        {/*/>*/}
      </FieldGroup>

      <Button size="sm" type="submit">
        Apply
      </Button>
    </form>
  );
}
