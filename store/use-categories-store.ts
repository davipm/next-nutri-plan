import { useShallow } from 'zustand/react/shallow';
import { createStore } from '@/store/create-store';

/**
 * State shape for the categories store
 */
type CategoriesState = {
  /** Currently selected category ID for viewing/editing */
  selectedCategoryId: number | null;
  /** Controls the category create/edit dialog visibility */
  categoryDialogOpen: boolean;
  /** Mode of the dialog - create new or edit existing */
  dialogMode: 'create' | 'edit';
};

/**
 * Actions available in the categories store
 */
type CategoriesActions = {
  // Selection actions
  setSelectedCategoryId: (id: number | null) => void;
  clearSelection: () => void;

  // Dialog actions
  setCategoryDialogOpen: (isOpen: boolean) => void;
  openCreateDialog: () => void;
  openEditDialog: (categoryId: number) => void;
  closeDialog: () => void;

  // Composite actions
  resetStore: () => void;
};

type CategoriesStore = CategoriesState & CategoriesActions;

/**
 * Initial state for the categories store
 */
const initialState: CategoriesState = {
  selectedCategoryId: null,
  categoryDialogOpen: false,
  dialogMode: 'create',
};

/**
 * Store for managing category selection and dialog state
 * Dialog state is excluded from persistence as it's transient UI state
 */
export const useCategoriesStore = createStore<CategoriesStore>(
  (set, get) => ({
    // Initial state
    ...initialState,

    // Selection actions
    setSelectedCategoryId: (id) =>
      set((state) => {
        state.selectedCategoryId = id;
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedCategoryId = null;
      }),

    // Dialog actions
    setCategoryDialogOpen: (isOpen) =>
      set((state) => {
        state.categoryDialogOpen = isOpen;
        // Clear selection when closing dialog
        if (!isOpen) {
          state.selectedCategoryId = null;
        }
      }),

    openCreateDialog: () =>
      set((state) => {
        state.dialogMode = 'create';
        state.categoryDialogOpen = true;
        state.selectedCategoryId = null;
      }),

    openEditDialog: (categoryId) =>
      set((state) => {
        state.dialogMode = 'edit';
        state.categoryDialogOpen = true;
        state.selectedCategoryId = categoryId;
      }),

    closeDialog: () =>
      set((state) => {
        state.categoryDialogOpen = false;
        state.selectedCategoryId = null;
      }),

    // Composite actions
    resetStore: () => set(initialState),
  }),
  {
    name: 'categories-store',
    // Don't persist transient UI state
    excludeFromPersist: ['categoryDialogOpen', 'dialogMode', 'selectedCategoryId'],
  }
);

// =============================================================================
// Selectors for optimized re-renders
// =============================================================================

/**
 * Get the selected category ID
 * Only re-renders when selectedCategoryId changes
 */
export const useSelectedCategoryId = () => useCategoriesStore((state) => state.selectedCategoryId);

/**
 * Get dialog state (open + mode)
 * Only re-renders when dialog state changes
 * Uses shallow comparison to prevent unnecessary re-renders
 */
export const useCategoryDialogState = () =>
  useCategoriesStore(
    useShallow((state) => ({
      open: state.categoryDialogOpen,
      mode: state.dialogMode,
      selectedId: state.selectedCategoryId,
    }))
  );

/**
 * Get only the dialog actions (never re-renders)
 * Use this when you only need actions, not state
 */
export const useCategoryDialogActions = () =>
  useCategoriesStore(
    useShallow((state) => ({
      openCreate: state.openCreateDialog,
      openEdit: state.openEditDialog,
      close: state.closeDialog,
    }))
  );

/**
 * Get only selection actions (never re-renders)
 */
export const useCategorySelectionActions = () =>
  useCategoriesStore(
    useShallow((state) => ({
      select: state.setSelectedCategoryId,
      clear: state.clearSelection,
    }))
  );

// =============================================================================
// Convenience functions for imperative usage
// =============================================================================

/**
 * Open the create category dialog
 * Can be called from anywhere in the app
 *
 * @example
 * <Button onClick={openCreateCategoryDialog}>Create Category</Button>
 */
export const openCreateCategoryDialog = (): void => {
  useCategoriesStore.getState().openCreateDialog();
};

/**
 * Open the edit category dialog
 *
 * @example
 * <Button onClick={() => openEditCategoryDialog(category.id)}>Edit</Button>
 */
export const openEditCategoryDialog = (categoryId: number): void => {
  useCategoriesStore.getState().openEditDialog(categoryId);
};

/**
 * Close the category dialog
 *
 * @example
 * <Dialog onClose={closeCategoryDialog}>...</Dialog>
 */
export const closeCategoryDialog = (): void => {
  useCategoriesStore.getState().closeDialog();
};

/**
 * Select a category
 *
 * @example
 * <CategoryItem onClick={() => selectCategory(category.id)} />
 */
export const selectCategory = (id: number | null): void => {
  useCategoriesStore.getState().setSelectedCategoryId(id);
};
