import { createStore } from '@/store/create-store';

type State = {
  selectedCategoryId: number | null;
  categoryDialogOpen: boolean;
};

type Actions = {
  setSelectedCategoryId: (id: State['selectedCategoryId']) => void;
  setCategoryDialogOpen: (isOpen: State['categoryDialogOpen']) => void;
};

type Store = State & Actions;

/**
 * A store that manages category state, including selected category and dialog visibility.
 *
 * @property selectedCategoryId - The currently selected category's ID. Initially set to null.
 * @property setSelectedCategoryId - Updates the selectedCategoryId property.
 * @property categoryDialogOpen - Flag that determines if the category dialog is open or closed. Initially set to false.
 * @property setCategoryDialogOpen - Updates the categoryDialogOpen property.
 */
export const useCategoriesStore = createStore<Store>(
  (set) => ({
    selectedCategoryId: null,
    categoryDialogOpen: false,
    setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
    setCategoryDialogOpen: (isOpen) => set({ categoryDialogOpen: isOpen }),
  }),
  { name: 'categories-store' },
);
