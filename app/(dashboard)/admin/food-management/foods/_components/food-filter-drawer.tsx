'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FilterIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import {
  ALL_CATEGORIES_VALUE,
  FILTER_RANGE_MAX,
  FILTER_RANGE_MIN,
  type FoodFiltersFormValues,
  getActiveFiltersCount,
  normalizeRangeValues,
  sortByOptions,
  sortOrderOptions,
} from '@/app/(dashboard)/admin/food-management/foods/_utils/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Slider } from '@/components/ui/slider';
import { orpc } from '@/lib/orpc';
import { useDebounce } from '@/lib/use-debounce';
import { foodFiltersSchema } from '@/server/modules/food/food.schema';
import {
  foodFiltersDefaultValues,
  useFoodFilterActions,
  useFoodFilters,
  useFoodFiltersDrawer,
} from '@/store/use-food-store';

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

  const onHandleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      openDrawer();
      return;
    }
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
      onOpenChange={onHandleOpenChange}
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

            <Card>
              <CardHeader>
                <CardTitle>Calories (kcal)</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
              </CardHeader>

              <CardContent>
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="caloriesRange"
                    render={({ field, fieldState }) => {
                      const rangeValues = normalizeRangeValues(field.value);

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between gap-2">
                            <FieldLabel id={`${field.name}-label`}>Calories (kcal)</FieldLabel>
                            <span className="text-muted-foreground text-sm">
                              {rangeValues[0]} - {rangeValues[1]}
                            </span>
                          </div>
                          <Slider
                            aria-invalid={fieldState.invalid}
                            aria-labelledby={`${field.name}-label`}
                            max={FILTER_RANGE_MAX}
                            min={FILTER_RANGE_MIN}
                            onValueChange={(value) => {
                              const [min = FILTER_RANGE_MIN, max = FILTER_RANGE_MAX] = value;
                              field.onChange([String(min), String(Math.max(min, max))]);
                            }}
                            step={1}
                            value={rangeValues}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      );
                    }}
                  />

                  <Controller
                    control={form.control}
                    name="proteinRange"
                    render={({ field, fieldState }) => {
                      const rangeValues = normalizeRangeValues(field.value);

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between gap-2">
                            <FieldLabel id={`${field.name}-label`}>Protein (g)</FieldLabel>
                            <span className="text-muted-foreground text-sm">
                              {rangeValues[0]} - {rangeValues[1]}
                            </span>
                          </div>
                          <Slider
                            aria-invalid={fieldState.invalid}
                            aria-labelledby={`${field.name}-label`}
                            max={FILTER_RANGE_MAX}
                            min={FILTER_RANGE_MIN}
                            onValueChange={(value) => {
                              const [min = FILTER_RANGE_MIN, max = FILTER_RANGE_MAX] = value;
                              field.onChange([String(min), String(Math.max(min, max))]);
                            }}
                            step={1}
                            value={rangeValues}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
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
