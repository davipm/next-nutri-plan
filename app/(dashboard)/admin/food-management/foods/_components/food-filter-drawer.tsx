'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FilterIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
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
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useDebounce } from '@/lib/use-debounce';
import { type FoodFiltersInput, foodFiltersSchema } from '@/server/modules/food/food.schema';
import { useFoodFilterActions, useFoodFilters, useFoodFiltersDrawer } from '@/store/use-food-store';

const sortByOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Calories', value: 'calories' },
  { label: 'Carbohydrates', value: 'carbohydrates' },
  { label: 'Fat', value: 'fat' },
  { label: 'Protein', value: 'protein' },
];

const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export function FoodFilterDrawer() {
  const { setFilters, setSearchTerm } = useFoodFilterActions();
  const { closeDrawer } = useFoodFiltersDrawer();
  const filters = useFoodFilters();

  const form = useForm<FoodFiltersInput>({
    defaultValues: filters,
    resolver: zodResolver(foodFiltersSchema),
  });

  const searchTerm = useWatch({ control: form.control, name: 'searchTerm' });
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const onSubmit: SubmitHandler<FoodFiltersInput> = (data) => {
    setFilters(data);
    closeDrawer();
  };

  const handleReset = () => {
    form.reset();
  };

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  return (
    <Drawer direction="right" handleOnly>
      <div className="flex gap-2">
        <FieldGroup className="max-w-48">
          <Controller
            name="searchTerm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="Quick Search"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <DrawerTrigger asChild>
          <Button>
            <FilterIcon />
            Filter
            <Badge>Badge</Badge>
          </Button>
        </DrawerTrigger>
      </div>

      <DrawerContent>
        <form className="h-full flex-col">
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Customize your food search criteria.</DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 px-4">
            <div className="flex flex-wrap gap-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort By" />
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

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort Order" />
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
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="mx-auto grid w-full gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="slider-demo-temperature">Calories</Label>
                  <span className="text-muted-foreground text-sm">250 g</span>
                </div>
                <Slider
                  defaultValue={[75]}
                  max={9999}
                  step={1}
                  className="mx-auto w-full max-w-xs"
                />
              </div>

              <div className="mx-auto grid w-full gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="slider-demo-temperature">Protein</Label>
                  <span className="text-muted-foreground text-sm">250 g</span>
                </div>
                <Slider
                  defaultValue={[75]}
                  max={9999}
                  step={1}
                  className="mx-auto w-full max-w-xs"
                />
              </div>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button variant="outline" type="button">
              Reset
            </Button>
            <Button type="submit">Apply Filters</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
