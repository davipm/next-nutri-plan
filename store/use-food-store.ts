import type { FoodFiltersInput } from '@/server/modules/food/food.schema';
import { createStore } from '@/store/create-store';

type State = {
  selectedFoodId: number | null;
  foodDialogOpen: boolean;
  foodFilters: FoodFiltersInput;
  foodFiltersDrawerOpen: boolean;
};

type Actions = {
  updateSelectedFoodId: (id: State['selectedFoodId']) => void;
  updateFoodDialogOpen: (isOpen: State['foodDialogOpen']) => void;
  updateFoodFilters: (filters: State['foodFilters']) => void;
  resetFoodFilters: () => void;
  updateFoodFiltersDrawerOpen: (isOpen: State['foodFiltersDrawerOpen']) => void;
  updateFoodFilterPage: (action: 'next' | 'prev' | number) => void;
  updateFoodFiltersSearchTerm: (term: State['foodFilters']['searchTerm']) => void;
};

type Store = State & Actions;

export const foodFiltersDefaultValues: FoodFiltersInput = {
  searchTerm: '',
  caloriesRange: ['0', '9999'],
  proteinRange: ['0', '9999'],
  categoryId: '',
  sortBy: 'name',
  sortOrder: 'desc',
  pageSize: 12,
  page: 1,
};

export const useFoodsStore = createStore<Store>(
  (set) => ({
    selectedFoodId: null,
    foodDialogOpen: false,
    foodFilters: foodFiltersDefaultValues,
    foodFiltersDrawerOpen: false,

    updateSelectedFoodId: (id) =>
      set((state) => {
        state.selectedFoodId = id;
      }),

    updateFoodDialogOpen: (isOpen) =>
      set((state) => {
        state.foodDialogOpen = isOpen;
      }),

    updateFoodFilters: (filters) =>
      set((state) => {
        state.foodFilters = filters;
      }),

    resetFoodFilters: () =>
      set((state) => {
        state.foodFilters = foodFiltersDefaultValues;
      }),

    updateFoodFiltersDrawerOpen: (isOpen) =>
      set((state) => {
        state.foodFiltersDrawerOpen = isOpen;
      }),

    updateFoodFilterPage: (action) =>
      set((state) => {
        const { page } = state.foodFilters;

        if (action === 'next') {
          state.foodFilters.page = page + 1;
        } else if (action === 'prev') {
          state.foodFilters.page = Math.max(1, page - 1);
        } else {
          state.foodFilters.page = action;
        }
      }),

    updateFoodFiltersSearchTerm: (searchTerm) =>
      set((state) => {
        state.foodFilters.searchTerm = searchTerm;
        state.foodFilters.page = 1;
      }),
  }),
  {
    name: 'foods-store',
    excludeFromPersist: ['foodFilters'],
  },
);
