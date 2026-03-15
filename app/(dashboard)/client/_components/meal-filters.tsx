'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type MealFiltersInput, mealFiltersSchema } from '@/server/modules/meal/meal.schema';
import { useMealFilterActions, useMealFilters } from '@/store/use-meal-store';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function MealFilters() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date('2025-06-01'));
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const mealFilters = useMealFilters();
  const { setFilters } = useMealFilterActions();

  const form = useForm({
    defaultValues: mealFilters,
    resolver: zodResolver(mealFiltersSchema),
  });

  const onSubmit: SubmitHandler<MealFiltersInput> = (data) => {
    setFilters(data);
  };

  return (
    <form className="mb-4 flex items-center gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="col-span-1 grid">
        <Controller
          control={form.control}
          name="dateTime"
          render={({ field, fieldState }) => (
            <Field className="mx-auto w-48">
              <FieldLabel htmlFor="date-required">Subscription Date</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="date-required"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setValue(e.target.value);
                    if (isValidDate(date)) {
                      setDate(date);
                      setMonth(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                  placeholder="June 01, 2025"
                  value={value}
                />
                <InputGroupAddon align="inline-end">
                  <Popover onOpenChange={setOpen} open={open}>
                    <PopoverTrigger asChild>
                      <InputGroupButton
                        aria-label="Select date"
                        id="date-picker"
                        size="icon-xs"
                        variant="ghost"
                      >
                        <CalendarIcon />
                        <span className="sr-only">Select date</span>
                      </InputGroupButton>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      alignOffset={-8}
                      className="w-auto overflow-hidden p-0"
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                          setDate(date);
                          setValue(formatDate(date));
                          setOpen(false);
                        }}
                        selected={date}
                      />
                    </PopoverContent>
                  </Popover>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          )}
        />
      </FieldGroup>

      <Button size="sm" type="submit">
        Apply
      </Button>
    </form>
  );
}
