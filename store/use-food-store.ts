import { useShallow } from 'zustand/react/shallow';
import type { FoodFiltersInput } from '@/server/modules/food/food.schema';
import { createStore } from '@/store/create-store';

/**
 * State shape for the foods store
 */
type FoodsState = {
  /** Currently selected food ID for viewing/editing */
  selectedFoodId: number | null;
  /** Controls the food create/edit dialog visibility */
  foodDialogOpen: boolean;
  /** Active filters applied to the food list */
  foodFilters: FoodFiltersInput;
  /** Controls the filters drawer visibility */
  foodFiltersDrawerOpen: boolean;
};

/**
 * Actions available in the foods store
 */
type FoodsActions = {
  // Selection actions
  setSelectedFoodId: (id: number | null) => void;
  clearSelection: () => void;

  // Dialog actions
  setFoodDialogOpen: (isOpen: boolean) => void;
  openFoodDialog: (foodId?: number) => void;
  closeFoodDialog: () => void;

  // Filter actions
  setFoodFilters: (filters: Partial<FoodFiltersInput>) => void;
  resetFoodFilters: () => void;
  setFoodFilterPage: (action: 'next' | 'prev' | number) => void;
  setFoodFiltersSearchTerm: (term: string) => void;

  // Filters drawer actions
  setFoodFiltersDrawerOpen: (isOpen: boolean) => void;
  openFoodFiltersDrawer: () => void;
  closeFoodFiltersDrawer: () => void;

  // Composite actions
  resetStore: () => void;
};

type FoodsStore = FoodsState & FoodsActions;

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

/**
 * Initial state for the foods store
 */
const initialState: FoodsState = {
  selectedFoodId: null,
  foodDialogOpen: false,
  foodFilters: foodFiltersDefaultValues,
  foodFiltersDrawerOpen: false,
};

/**
 * Store for managing food selection, dialog, and filter state.
 * Filters are excluded from persistence as they are transient UI state.
 */
export const useFoodsStore = createStore<FoodsStore>(
  (set, get) => ({
    // Initial state
    ...initialState,

    // Selection actions
    setSelectedFoodId: (id) =>
      set((state) => {
        state.selectedFoodId = id;
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedFoodId = null;
      }),

    // Dialog actions
    setFoodDialogOpen: (isOpen) =>
      set((state) => {
        state.foodDialogOpen = isOpen;
        if (!isOpen) state.selectedFoodId = null;
      }),

    openFoodDialog: (foodId) =>
      set((state) => {
        state.foodDialogOpen = true;
        state.selectedFoodId = foodId ?? null;
      }),

    closeFoodDialog: () =>
      set((state) => {
        state.foodDialogOpen = false;
        state.selectedFoodId = null;
      }),

    // Filter actions
    setFoodFilters: (filters) =>
      set((state) => {
        state.foodFilters = { ...state.foodFilters, ...filters };
      }),

    resetFoodFilters: () =>
      set((state) => {
        state.foodFilters = foodFiltersDefaultValues;
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

    // Resets page to 1 on new search to prevent empty result pages
    setFoodFiltersSearchTerm: (searchTerm) =>
      set((state) => {
        state.foodFilters.searchTerm = searchTerm;
        state.foodFilters.page = 1;
      }),

    // Filters drawer actions
    setFoodFiltersDrawerOpen: (isOpen) =>
      set((state) => {
        state.foodFiltersDrawerOpen = isOpen;
      }),

    openFoodFiltersDrawer: () =>
      set((state) => {
        state.foodFiltersDrawerOpen = true;
      }),

    closeFoodFiltersDrawer: () =>
      set((state) => {
        state.foodFiltersDrawerOpen = false;
      }),

    // Composite actions
    resetStore: () => set(initialState),
  }),
  {
    name: 'foods-store',
    excludeFromPersist: [
      'foodFilters',
      'foodDialogOpen',
      'foodFiltersDrawerOpen',
      'selectedFoodId',
    ],
  },
);

// =============================================================================
// Selectors for optimized re-renders
// =============================================================================

/**
 * Get the selected food ID.
 * Only re-renders when selectedFoodId changes.
 */
export const useSelectedFoodId = () => useFoodsStore((state) => state.selectedFoodId);

/**
 * Get the active food filters.
 * Only re-renders when filters change.
 */
export const useFoodFilters = () => useFoodsStore((state) => state.foodFilters);

/**
 * Get the food dialog state.
 * Uses shallow comparison to prevent unnecessary re-renders.
 */
export const useFoodDialogState = () =>
  useFoodsStore(
    useShallow((state) => ({
      open: state.foodDialogOpen,
      selectedId: state.selectedFoodId,
    })),
  );

/**
 * Get the food dialog actions (never re-renders).
 * Use this when you only need actions, not state.
 */
export const useFoodDialogActions = () =>
  useFoodsStore(
    useShallow((state) => ({
      open: state.openFoodDialog,
      close: state.closeFoodDialog,
    })),
  );

/**
 * Get the filters drawer state + actions (never re-renders on action ref changes).
 */
export const useFoodFiltersDrawer = () =>
  useFoodsStore(
    useShallow((state) => ({
      open: state.foodFiltersDrawerOpen,
      openDrawer: state.openFoodFiltersDrawer,
      closeDrawer: state.closeFoodFiltersDrawer,
    })),
  );

/**
 * Get the filter actions (never re-renders).
 * Use this when you only need to mutate filters, not read them.
 */
export const useFoodFilterActions = () =>
  useFoodsStore(
    useShallow((state) => ({
      setFilters: state.setFoodFilters,
      resetFilters: state.resetFoodFilters,
      setPage: state.setFoodFilterPage,
      setSearchTerm: state.setFoodFiltersSearchTerm,
    })),
  );

/**
 * Returns true when any filter differs from the default values.
 * Derived on read — no extra state stored.
 */
export const useIsFiltersActive = () =>
  useFoodsStore((state) => {
    const f = state.foodFilters;
    const d = foodFiltersDefaultValues;
    return (
      f.searchTerm !== d.searchTerm ||
      f.categoryId !== d.categoryId ||
      f.sortBy !== d.sortBy ||
      f.sortOrder !== d.sortOrder ||
      f.caloriesRange[0] !== d.caloriesRange[0] ||
      f.caloriesRange[1] !== d.caloriesRange[1] ||
      f.proteinRange[0] !== d.proteinRange[0] ||
      f.proteinRange[1] !== d.proteinRange[1]
    );
  });

// =============================================================================
// Convenience functions for imperative usage
// =============================================================================

/**
 * Open the food dialog in create mode.
 * Can be called from anywhere without a hook.
 *
 * @example
 * <Button onClick={openFoodDialog}>Add Food</Button>
 */
export const openFoodDialog = (): void => {
  useFoodsStore.getState().openFoodDialog();
};

/**
 * Open the food dialog in edit mode.
 *
 * @example
 * <Button onClick={() => openFoodEditDialog(food.id)}>Edit</Button>
 */
export const openFoodEditDialog = (foodId: number): void => {
  useFoodsStore.getState().openFoodDialog(foodId);
};

/**
 * Close the food dialog.
 *
 * @example
 * <Dialog onClose={closeFoodDialog}>...</Dialog>
 */
export const closeFoodDialog = (): void => {
  useFoodsStore.getState().closeFoodDialog();
};

/**
 * Select a food item imperatively.
 *
 * @example
 * <FoodItem onClick={() => selectFood(food.id)} />
 */
export const selectFood = (id: number | null): void => {
  useFoodsStore.getState().setSelectedFoodId(id);
};

/**
 * Reset all food filters imperatively.
 *
 * @example
 * <Button onClick={resetFoodFilters}>Clear all</Button>
 */
export const resetFoodFilters = (): void => {
  useFoodsStore.getState().resetFoodFilters();
};
