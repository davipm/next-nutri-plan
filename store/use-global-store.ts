import { createStore } from '@/store/create-store';

export type AlertConfig = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  showCancel?: boolean;
};

type GlobalState = {
  alertOpen: boolean;
  alertConfig: AlertConfig | null;
};

type GlobalActions = {
  showAlert: (config: AlertConfig) => void;
  closeAlert: () => void;
  handleAlertConfirm: () => Promise<void>;
  handleAlertCancel: () => void;
};

type GlobalStore = GlobalState & GlobalActions;

export const useGlobalStore = createStore<GlobalStore>(
  (set, get) => ({
    alertOpen: false,
    alertConfig: null,

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
        state.alertConfig = null;
      }),

    handleAlertConfirm: async () => {
      const { alertConfig } = get();

      if (alertConfig?.onConfirm) {
        await alertConfig.onConfirm();
      }

      get().closeAlert();
    },

    handleAlertCancel: () => {
      const { alertConfig } = get();
      alertConfig?.onCancel?.();
      get().closeAlert();
    },
  }),
  {
    name: 'global-store',
    excludeFromPersist: ['alertOpen', 'alertConfig'],
  },
);

export const alert = (config: AlertConfig): void => {
  useGlobalStore.getState().showAlert(config);
};

export const closeAlert = (): void => {
  useGlobalStore.getState().closeAlert();
};

export const useAlertState = () =>
  useGlobalStore((state) => ({
    open: state.alertOpen,
    config: state.alertConfig,
  }));

export const useAlertActions = () =>
  useGlobalStore((state) => ({
    showAlert: state.showAlert,
    closeAlert: state.closeAlert,
    handleConfirm: state.handleAlertConfirm,
    handleCancel: state.handleAlertCancel,
  }));
