'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { mealFiltersSchema } from '@/server/modules/meal/meal.schema';
import { useMealFilterActions, useMealFilters } from '@/store/use-meal-store';

function formatDate(date: Date) {
  return format(date, 'EEEE, MMMM dd, yyyy');
}

const mealFiltersFormSchema = z.object({
  dateTime: z.date().optional(),
});

type MealFiltersFormValues = z.infer<typeof mealFiltersFormSchema>;

export function MealFilters() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const mealFilters = useMealFilters();
  const { setFilters } = useMealFilterActions();

  const form = useForm<MealFiltersFormValues>({
    defaultValues: mealFilters,
    resolver: zodResolver(mealFiltersFormSchema),
  });

  useEffect(() => {
    form.reset(mealFilters);
  }, [form, mealFilters]);

  const onSubmit: SubmitHandler<MealFiltersFormValues> = (data) => {
    const { dateTime } = mealFiltersSchema.parse(data);

    setFilters({ dateTime });
  };

  return (
    <form
      className="mb-4 flex w-full min-w-0 flex-col gap-3 sm:flex-1 sm:flex-row sm:items-end"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="w-70 sm:max-w-md">
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

      <Button type="submit">Apply</Button>
    </form>
  );
}
