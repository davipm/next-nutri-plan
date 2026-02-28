import type { z } from 'zod';
import type { FoodFiltersInput, foodFiltersSchema } from '@/server/modules/food/food.schema';
import { foodFiltersDefaultValues } from '@/store/use-food-store';

export const sortByOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Calories', value: 'calories' },
  { label: 'Protein', value: 'protein' },
  { label: 'Most Recent', value: 'createdAt' },
];

export const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export const ALL_CATEGORIES_VALUE = 'all';
export const FILTER_RANGE_MIN = 0;
export const FILTER_RANGE_MAX = 9999;

export type FoodFiltersFormValues = z.input<typeof foodFiltersSchema>;

export function normalizeRangeValues(range?: [string, string]): [number, number] {
  const rawMin = Number(range?.[0] ?? FILTER_RANGE_MIN);
  const rawMax = Number(range?.[1] ?? FILTER_RANGE_MAX);

  const min = Number.isFinite(rawMin)
    ? Math.min(Math.max(rawMin, FILTER_RANGE_MIN), FILTER_RANGE_MAX)
    : FILTER_RANGE_MIN;
  const maxCandidate = Number.isFinite(rawMax)
    ? Math.min(Math.max(rawMax, FILTER_RANGE_MIN), FILTER_RANGE_MAX)
    : FILTER_RANGE_MAX;
  const max = Math.max(min, maxCandidate);

  return [min, max];
}

export function getActiveFiltersCount(filters: FoodFiltersInput): number {
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
