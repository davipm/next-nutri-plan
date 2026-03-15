import { useShallow } from 'zustand/react/shallow';
import type { MealFiltersInput } from '@/server/modules/meal/meal.schema';
import { createStore } from '@/store/create-store';

/**
 * State shape for the meals store
 */
interface MealsState {
  /** Controls the meal create/edit dialog visibility */
  mealDialogOpen: boolean;
  /** Active filters applied to the meals list */
  mealFilters: MealFiltersInput;
  /** Currently selected meal ID for viewing/editing */
  selectedMealId: number | null;
}

/**
 * Actions available in the meals store
 */
interface MealsActions {
  clearSelection: () => void;
  closeMealDialog: () => void;
  openMealDialog: (mealId?: number) => void;
  resetMealFilters: () => void;

  // Composite actions
  resetStore: () => void;

  // Dialog actions
  setMealDialogOpen: (isOpen: boolean) => void;

  // Filter actions
  setMealFilters: (filters: Partial<MealFiltersInput>) => void;

  // Selection actions
  setSelectedMealId: (id: number | null) => void;
}

type MealsStore = MealsState & MealsActions;

export const mealFiltersDefaultValues: MealFiltersInput = {};

/**
 * Initial state for the meals store
 */
const initialState: MealsState = {
  selectedMealId: null,
  mealDialogOpen: false,
  mealFilters: mealFiltersDefaultValues,
};

/**
 * Store for managing meal selection, dialog, and filter state.
 * Transient UI state is excluded from persistence.
 */
export const useMealStore = createStore<MealsStore>(
  (set) => ({
    // Initial state
    ...initialState,

    // Selection actions
    setSelectedMealId: (id) =>
      set((state) => {
        state.selectedMealId = id;
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedMealId = null;
      }),

    // Dialog actions
    setMealDialogOpen: (isOpen) =>
      set((state) => {
        state.mealDialogOpen = isOpen;
        if (!isOpen) {
          state.selectedMealId = null;
        }
      }),

    openMealDialog: (mealId) =>
      set((state) => {
        state.mealDialogOpen = true;
        state.selectedMealId = mealId ?? null;
      }),

    closeMealDialog: () =>
      set((state) => {
        state.mealDialogOpen = false;
        state.selectedMealId = null;
      }),

    // Filter actions
    setMealFilters: (filters) =>
      set((state) => {
        state.mealFilters = { ...state.mealFilters, ...filters };
      }),

    resetMealFilters: () =>
      set((state) => {
        state.mealFilters = mealFiltersDefaultValues;
      }),

    // Composite actions
    resetStore: () => set(initialState),
  }),
  {
    name: 'meal-store',
    excludeFromPersist: ['mealFilters', 'mealDialogOpen', 'selectedMealId'],
  }
);

// =============================================================================
// Selectors for optimized re-renders
// =============================================================================

/**
 * Get the selected meal ID.
 * Only re-renders when selectedMealId changes.
 */
export const useSelectedMealId = () => useMealStore((state) => state.selectedMealId);

/**
 * Get the active meal filters.
 * Only re-renders when filters change.
 */
export const useMealFilters = () => useMealStore((state) => state.mealFilters);

/**
 * Get the meal dialog state.
 * Uses shallow comparison to prevent unnecessary re-renders.
 */
export const useMealDialogState = () =>
  useMealStore(
    useShallow((state) => ({
      open: state.mealDialogOpen,
      selectedId: state.selectedMealId,
    }))
  );

/**
 * Get the meal dialog actions (never re-renders).
 * Use this when you only need actions, not state.
 */
export const useMealDialogActions = () =>
  useMealStore(
    useShallow((state) => ({
      open: state.openMealDialog,
      close: state.closeMealDialog,
    }))
  );

/**
 * Get the meal selection actions (never re-renders).
 */
export const useMealSelectionActions = () =>
  useMealStore(
    useShallow((state) => ({
      select: state.setSelectedMealId,
      clear: state.clearSelection,
    }))
  );

/**
 * Get the filter actions (never re-renders).
 * Use this when you only need to mutate filters, not read them.
 */
export const useMealFilterActions = () =>
  useMealStore(
    useShallow((state) => ({
      setFilters: state.setMealFilters,
      resetFilters: state.resetMealFilters,
    }))
  );

// =============================================================================
// Convenience functions for imperative usage
// =============================================================================

/**
 * Open the meal dialog in create mode.
 * Can be called from anywhere without a hook.
 */
export const openMealDialog = (): void => {
  useMealStore.getState().openMealDialog();
};

/**
 * Open the meal dialog in edit mode.
 */
export const openMealEditDialog = (mealId: number): void => {
  useMealStore.getState().openMealDialog(mealId);
};

/**
 * Close the meal dialog.
 */
export const closeMealDialog = (): void => {
  useMealStore.getState().closeMealDialog();
};

/**
 * Select a meal imperatively.
 */
export const selectMeal = (id: number | null): void => {
  useMealStore.getState().setSelectedMealId(id);
};

/**
 * Reset all meal filters imperatively.
 */
export const resetMealFilters = (): void => {
  useMealStore.getState().resetMealFilters();
};
