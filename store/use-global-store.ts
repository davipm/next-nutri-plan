import { useShallow } from 'zustand/react/shallow';
import { createStore } from '@/store/create-store';

/**
 * Configuration for alert dialogs
 */
export interface AlertConfig {
  /** Custom cancel button label */
  cancelLabel?: string;
  /** Custom confirm button label */
  confirmLabel?: string;
  /** Alert description/message */
  description?: string;
  /** Callback when user cancels */
  onCancel?: () => void | Promise<void>;
  /** Callback when user confirms */
  onConfirm?: () => void | Promise<void>;
  /** Hide cancel button for info-only alerts */
  showCancel?: boolean;
  /** Alert title */
  title?: string;
  /** Alert variant/severity */
  variant?: 'default' | 'destructive' | 'warning' | 'info';
}

/**
 * State shape for the global store
 */
interface GlobalState {
  alertConfig: AlertConfig | null;
  // Alert state
  alertOpen: boolean;

  // Add other global state here as needed
  // Example: toast notifications, global loading, etc.
}

/**
 * Actions available in the global store
 */
interface GlobalActions {
  closeAlert: () => void;
  handleAlertCancel: () => void;
  handleAlertConfirm: () => Promise<void>;
  // Alert actions
  showAlert: (config: AlertConfig) => void;

  // Future: Add other global actions
  // resetStore: () => void;
}

type GlobalStore = GlobalState & GlobalActions;

/**
 * Global store for app-wide state like alerts, toasts, modals
 * Alert state is excluded from persistence as it's transient UI state
 */
export const useGlobalStore = createStore<GlobalStore>(
  (set, get) => ({
    // Initial state
    alertOpen: false,
    alertConfig: null,

    // Alert actions
    showAlert: (config) =>
      set((state) => {
        state.alertOpen = true;
        state.alertConfig = {
          showCancel: true, // Default to showing cancel
          variant: 'default',
          ...config,
        };
      }),

    closeAlert: () =>
      set((state) => {
        state.alertOpen = false;
        // Keep config for animation exit, clear after delay if needed
        // Or clear immediately - depends on your UI needs
        state.alertConfig = null;
      }),

    handleAlertConfirm: async () => {
      const { alertConfig } = get();

      // Call the onConfirm callback if provided
      if (alertConfig?.onConfirm) {
        await alertConfig.onConfirm();
      }

      // Close the alert
      get().closeAlert();
    },

    handleAlertCancel: () => {
      const { alertConfig } = get();

      // Call the onCancel callback if provided
      alertConfig?.onCancel?.();

      // Close the alert
      get().closeAlert();
    },
  }),
  {
    name: 'global-store',
    // Exclude transient UI state from persistence
    excludeFromPersist: ['alertOpen', 'alertConfig'],
  }
);

/**
 * Convenience function to show an alert from anywhere in the app
 *
 * @example
 * // Simple confirmation
 * alert({
 *   title: 'Delete Item',
 *   description: 'Are you sure? This cannot be undone.',
 *   onConfirm: () => deleteItem(id)
 * });
 *
 * @example
 * // Custom labels and variant
 * alert({
 *   title: 'Warning',
 *   description: 'This action may take a while',
 *   confirmLabel: 'Proceed',
 *   cancelLabel: 'Go Back',
 *   variant: 'warning',
 *   onConfirm: async () => await longRunningTask()
 * });
 *
 * @example
 * // Info-only alert (no cancel)
 * alert({
 *   title: 'Success',
 *   description: 'Your changes have been saved',
 *   showCancel: false,
 *   variant: 'info'
 * });
 */
export const alert = (config: AlertConfig): void => {
  useGlobalStore.getState().showAlert(config);
};

/**
 * Convenience function to close the current alert
 */
export const closeAlert = (): void => {
  useGlobalStore.getState().closeAlert();
};

// Selectors for optimized re-renders
export const useAlertState = () =>
  useGlobalStore(
    useShallow((state) => ({
      open: state.alertOpen,
      config: state.alertConfig,
    }))
  );

export const useAlertActions = () =>
  useGlobalStore(
    useShallow((state) => ({
      showAlert: state.showAlert,
      closeAlert: state.closeAlert,
      handleConfirm: state.handleAlertConfirm,
      handleCancel: state.handleAlertCancel,
    }))
  );
