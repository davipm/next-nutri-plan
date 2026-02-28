'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FilterIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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
import { orpc } from '@/lib/orpc';
import { useDebounce } from '@/lib/use-debounce';
import { type FoodFiltersInput, foodFiltersSchema } from '@/server/modules/food/food.schema';
import {
  foodFiltersDefaultValues,
  useFoodFilterActions,
  useFoodFilters,
  useFoodFiltersDrawer,
} from '@/store/use-food-store';

const sortByOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Calories', value: 'calories' },
  { label: 'Protein', value: 'protein' },
  { label: 'Most Recent', value: 'createdAt' },
];

const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

const ALL_CATEGORIES_VALUE = 'all';
type FoodFiltersFormValues = z.input<typeof foodFiltersSchema>;

function getActiveFiltersCount(filters: FoodFiltersInput): number {
  let count = 0;

  if (filters.searchTerm?.trim()) {
    count += 1;
  }
  if (filters.categoryId?.trim()) {
    count += 1;
  }
  if (filters.sortBy !== foodFiltersDefaultValues.sortBy) {
    count += 1;
  }
  if (filters.sortOrder !== foodFiltersDefaultValues.sortOrder) {
    count += 1;
  }

  if (
    filters.caloriesRange[0] !== foodFiltersDefaultValues.caloriesRange[0] ||
    filters.caloriesRange[1] !== foodFiltersDefaultValues.caloriesRange[1]
  ) {
    count += 1;
  }

  if (
    filters.proteinRange[0] !== foodFiltersDefaultValues.proteinRange[0] ||
    filters.proteinRange[1] !== foodFiltersDefaultValues.proteinRange[1]
  ) {
    count += 1;
  }

  return count;
}

export function FoodFilterDrawer() {
  const { data: categories = [] } = useQuery(orpc.categories.list.queryOptions());
  const { setFilters, setSearchTerm, resetFilters } = useFoodFilterActions();
  const { open: foodFiltersDrawerOpen, openDrawer, closeDrawer } = useFoodFiltersDrawer();
  const filters = useFoodFilters();

  const form = useForm<FoodFiltersFormValues>({
    defaultValues: filters,
    resolver: zodResolver(foodFiltersSchema),
  });

  const activeFiltersCount = getActiveFiltersCount(filters);
  const searchTerm = useWatch({ control: form.control, name: 'searchTerm' }) ?? '';
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const onSubmit: SubmitHandler<FoodFiltersFormValues> = (data) => {
    const parsedFilters = foodFiltersSchema.parse(data);

    setFilters({ ...parsedFilters, page: 1 });
    closeDrawer();
  };

  const handleReset = () => {
    resetFilters();
    form.reset(foodFiltersDefaultValues);
    closeDrawer();
  };

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  useEffect(() => {
    if (!foodFiltersDrawerOpen) {
      form.reset(filters);
    }
  }, [foodFiltersDrawerOpen, filters, form]);

  return (
    <Drawer
      direction="right"
      handleOnly
      onOpenChange={(isOpen) => {
        if (isOpen) {
          openDrawer();
          return;
        }

        closeDrawer();
      }}
      open={foodFiltersDrawerOpen}
    >
      <div className="flex gap-2">
        <FieldGroup className="max-w-48">
          <Controller
            control={form.control}
            name="searchTerm"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id={field.name}
                  placeholder="Quick Search"
                  type="text"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <DrawerTrigger asChild>
          <Button type="button">
            <FilterIcon />
            Filter
            {activeFiltersCount > 0 && <Badge>{activeFiltersCount}</Badge>}
          </Button>
        </DrawerTrigger>
      </div>

      <DrawerContent>
        <form className="flex h-full flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Customize your food search criteria.</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-2">
            <FieldGroup>
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="food-category-filter">Category</FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(value === ALL_CATEGORIES_VALUE ? '' : value)
                      }
                      value={field.value?.trim() ? field.value : ALL_CATEGORIES_VALUE}
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

              <Controller
                control={form.control}
                name="sortBy"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="food-sort-by-filter">Sort By</FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value ?? foodFiltersDefaultValues.sortBy}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid} id="food-sort-by-filter">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sort By</SelectLabel>
                          {sortByOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="sortOrder"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="food-sort-order-filter">Sort Order</FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value ?? foodFiltersDefaultValues.sortOrder}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid} id="food-sort-order-filter">
                        <SelectValue placeholder="Sort order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sort Order</SelectLabel>
                          {sortOrderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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

            <FieldGroup>
              <Controller
                control={form.control}
                name="caloriesRange.0"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Calories Min</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      min={0}
                      placeholder="0"
                      step="any"
                      type="number"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="caloriesRange.1"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Calories Max</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      min={0}
                      placeholder="9999"
                      step="any"
                      type="number"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="proteinRange.0"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Protein Min (g)</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      min={0}
                      placeholder="0"
                      step="any"
                      type="number"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="proteinRange.1"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Protein Max (g)</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      min={0}
                      placeholder="9999"
                      step="any"
                      type="number"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button onClick={handleReset} type="button" variant="outline">
              Reset
            </Button>
            <Button type="submit">Apply Filters</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
