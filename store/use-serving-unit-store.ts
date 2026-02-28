import { useShallow } from 'zustand/react/shallow';
import { createStore } from '@/store/create-store';

/**
 * State shape for the serving units store
 */
type ServingUnitsState = {
  /** Currently selected serving unit ID for viewing/editing */
  selectedServingUnitId: number | null;
  /** Controls the serving unit create/edit dialog visibility */
  servingUnitDialogOpen: boolean;
  /** Mode of the dialog - create new or edit existing */
  dialogMode: 'create' | 'edit';
};

/**
 * Actions available in the serving units store
 */
type ServingUnitsActions = {
  // Selection actions
  setSelectedServingUnitId: (id: number | null) => void;
  clearSelection: () => void;

  // Dialog actions
  setServingUnitDialogOpen: (isOpen: boolean) => void;
  openCreateDialog: () => void;
  openEditDialog: (servingUnitId: number) => void;
  closeDialog: () => void;

  // Composite actions
  resetStore: () => void;
};

type ServingUnitsStore = ServingUnitsState & ServingUnitsActions;

/**
 * Initial state for the serving units store
 */
const initialState: ServingUnitsState = {
  selectedServingUnitId: null,
  servingUnitDialogOpen: false,
  dialogMode: 'create',
};

/**
 * Store for managing serving unit selection and dialog state
 * Dialog state is excluded from persistence as it's transient UI state
 */
export const useServingUnitsStore = createStore<ServingUnitsStore>(
  (set, get) => ({
    // Initial state
    ...initialState,

    // Selection actions
    setSelectedServingUnitId: (id) =>
      set((state) => {
        state.selectedServingUnitId = id;
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedServingUnitId = null;
      }),

    // Dialog actions
    setServingUnitDialogOpen: (isOpen) =>
      set((state) => {
        state.servingUnitDialogOpen = isOpen;
        // Clear selection when closing dialog
        if (!isOpen) {
          state.selectedServingUnitId = null;
        }
      }),

    openCreateDialog: () =>
      set((state) => {
        state.dialogMode = 'create';
        state.servingUnitDialogOpen = true;
        state.selectedServingUnitId = null;
      }),

    openEditDialog: (servingUnitId) =>
      set((state) => {
        state.dialogMode = 'edit';
        state.servingUnitDialogOpen = true;
        state.selectedServingUnitId = servingUnitId;
      }),

    closeDialog: () =>
      set((state) => {
        state.servingUnitDialogOpen = false;
        state.selectedServingUnitId = null;
      }),

    // Composite actions
    resetStore: () => set(initialState),
  }),
  {
    name: 'serving-units-store',
    // Don't persist transient UI state
    excludeFromPersist: ['servingUnitDialogOpen', 'dialogMode', 'selectedServingUnitId'],
  }
);

// =============================================================================
// Selectors for optimized re-renders
// =============================================================================

/**
 * Get the selected serving unit ID
 * Only re-renders when selectedServingUnitId changes
 */
export const useSelectedServingUnitId = () =>
  useServingUnitsStore((state) => state.selectedServingUnitId);

/**
 * Get dialog state (open + mode)
 * Only re-renders when dialog state changes
 * Uses shallow comparison to prevent unnecessary re-renders
 */
export const useServingUnitDialogState = () =>
  useServingUnitsStore(
    useShallow((state) => ({
      open: state.servingUnitDialogOpen,
      mode: state.dialogMode,
      selectedId: state.selectedServingUnitId,
    }))
  );

/**
 * Get only the dialog actions (never re-renders)
 * Use this when you only need actions, not state
 */
export const useServingUnitDialogActions = () =>
  useServingUnitsStore(
    useShallow((state) => ({
      openCreate: state.openCreateDialog,
      openEdit: state.openEditDialog,
      close: state.closeDialog,
    }))
  );

/**
 * Get only selection actions (never re-renders)
 */
export const useServingUnitSelectionActions = () =>
  useServingUnitsStore(
    useShallow((state) => ({
      select: state.setSelectedServingUnitId,
      clear: state.clearSelection,
    }))
  );

// =============================================================================
// Convenience functions for imperative usage
// =============================================================================

/**
 * Open the create serving unit dialog
 * Can be called from anywhere in the app
 *
 * @example
 * <Button onClick={openCreateServingUnitDialog}>Create Serving Unit</Button>
 */
export const openCreateServingUnitDialog = (): void => {
  useServingUnitsStore.getState().openCreateDialog();
};

/**
 * Open the edit serving unit dialog
 *
 * @example
 * <Button onClick={() => openEditServingUnitDialog(servingUnit.id)}>Edit</Button>
 */
export const openEditServingUnitDialog = (servingUnitId: number): void => {
  useServingUnitsStore.getState().openEditDialog(servingUnitId);
};

/**
 * Close the serving unit dialog
 *
 * @example
 * <Dialog onClose={closeServingUnitDialog}>...</Dialog>
 */
export const closeServingUnitDialog = (): void => {
  useServingUnitsStore.getState().closeDialog();
};

/**
 * Select a serving unit
 *
 * @example
 * <ServingUnitItem onClick={() => selectServingUnit(servingUnit.id)} />
 */
export const selectServingUnit = (id: number | null): void => {
  useServingUnitsStore.getState().setSelectedServingUnitId(id);
};
