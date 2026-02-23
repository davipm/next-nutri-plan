import type { FoodFiltersInput } from '@/server/modules/food/food.schema';
import { createStore } from '@/store/create-store';

type State = {
  selectedFoodId: number | null;
  foodDialogOpen: boolean;
  foodFilters: FoodFiltersInput;
  foodFiltersDrawerOpen: boolean;
};

type Actions = {
  setSelectedFoodId: (id: State['selectedFoodId']) => void;
  setFoodDialogOpen: (isOpen: boolean) => void;
  setFoodFilters: (filters: Partial<FoodFiltersInput>) => void;
  resetFoodFilters: () => void;
  setFoodFiltersDrawerOpen: (isOpen: boolean) => void;
  setFoodFilterPage: (action: 'next' | 'prev' | number) => void;
  setFoodFiltersSearchTerm: (term: string) => void;
};

// Derived state selectors — subscribe only to what you need (rule 5.8)
type Selectors = {
  isFiltersActive: () => boolean;
};

type Store = State & Actions & Selectors;

export const foodFiltersDefaultValues: FoodFiltersInput = {
  searchTerm: '',
  caloriesRange: ['0', '9999'],
  proteinRange: ['0', '9999'],
  categoryId: '',
  sortBy: 'name',
  sortOrder: 'desc',
  pageSize: 12,
  page: 1,
} as const;

export const useFoodsStore = createStore<Store>(
  (set, get) => ({
    // --- State ---
    selectedFoodId: null,
    foodDialogOpen: false,
    foodFilters: foodFiltersDefaultValues,
    foodFiltersDrawerOpen: false,

    // --- Selectors ---
    // Derived state: compute on read instead of storing redundantly (rule 5.1)
    isFiltersActive: () => {
      const { foodFilters } = get();
      return (
        foodFilters.searchTerm !== foodFiltersDefaultValues.searchTerm ||
        foodFilters.categoryId !== foodFiltersDefaultValues.categoryId ||
        foodFilters.sortBy !== foodFiltersDefaultValues.sortBy ||
        foodFilters.sortOrder !== foodFiltersDefaultValues.sortOrder ||
        foodFilters.caloriesRange[0] !== foodFiltersDefaultValues.caloriesRange[0] ||
        foodFilters.caloriesRange[1] !== foodFiltersDefaultValues.caloriesRange[1] ||
        foodFilters.proteinRange[0] !== foodFiltersDefaultValues.proteinRange[0] ||
        foodFilters.proteinRange[1] !== foodFiltersDefaultValues.proteinRange[1]
      );
    },

    // --- Actions ---
    setSelectedFoodId: (id) =>
      set((state) => {
        state.selectedFoodId = id;
      }),

    setFoodDialogOpen: (isOpen) =>
      set((state) => {
        state.foodDialogOpen = isOpen;
      }),

    // Accept partial updates to avoid callers re-spreading the whole object
    setFoodFilters: (filters) =>
      set((state) => {
        state.foodFilters = { ...state.foodFilters, ...filters };
      }),

    resetFoodFilters: () =>
      set((state) => {
        state.foodFilters = foodFiltersDefaultValues;
      }),

    setFoodFiltersDrawerOpen: (isOpen) =>
      set((state) => {
        state.foodFiltersDrawerOpen = isOpen;
      }),

    setFoodFilterPage: (action) =>
      set((state) => {
        const { page } = state.foodFilters;

        if (action === 'next') {
          state.foodFilters.page = page + 1;
        } else if (action === 'prev') {
          state.foodFilters.page = Math.max(1, page - 1);
        } else {
          state.foodFilters.page = Math.max(1, action);
        }
      }),

    // Resets page to 1 on search — prevents empty result pages
    setFoodFiltersSearchTerm: (searchTerm) =>
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

// Granular selectors — use these in components to avoid unnecessary re-renders (rule 5.8)
export const selectFoodFilters = (s: Store) => s.foodFilters;
export const selectSelectedFoodId = (s: Store) => s.selectedFoodId;
export const selectFoodDialogOpen = (s: Store) => s.foodDialogOpen;
export const selectFoodFiltersDrawerOpen = (s: Store) => s.foodFiltersDrawerOpen;
export const selectIsFiltersActive = (s: Store) => s.isFiltersActive();
