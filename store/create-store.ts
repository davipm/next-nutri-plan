import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type StoreConfig<T> = {
  name?: string;
  storage?: Storage;
  skipPersist?: boolean;
  excludeFromPersist?: Array<keyof T>;
  devtools?: {
    enabled?: boolean;
    name?: string;
  };
  partialize?: (state: T) => Partial<T>;
  merge?: (persistedState: unknown, currentState: T) => T;
  version?: number;
  migrate?: (persistedState: unknown, version: number) => T | Promise<T>;
};

export const createStore = <T extends object>(
  storeCreator: StateCreator<T, [['zustand/immer', never]], []>,
  config?: StoreConfig<T>
) => {
  const {
    name,
    storage,
    skipPersist = false,
    excludeFromPersist = [],
    devtools: devtoolsConfig,
    partialize: customPartialize,
    merge,
    version,
    migrate,
  } = config || {};

  if (!(skipPersist || name)) {
    throw new Error(
      'createStore: `config.name` is required when persistence is enabled. ' +
        'Set `skipPersist: true` for memory-only stores or provide a unique name.'
    );
  }

  let enhancedStoreCreator = immer(storeCreator);
  const isDevtoolsEnabled =
    devtoolsConfig?.enabled ??
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

  if (isDevtoolsEnabled) {
    enhancedStoreCreator = devtools(enhancedStoreCreator, {
      name: devtoolsConfig?.name || name || 'zustand-store',
      enabled: true,
    }) as typeof enhancedStoreCreator;
  }

  if (skipPersist) {
    return create<T>()(enhancedStoreCreator);
  }

  return create<T>()(
    persist(enhancedStoreCreator, {
      name: name!,
      storage: createJSONStorage(() => {
        if (storage) {
          return storage;
        }

        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage;
        }

        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        } as unknown as Storage;
      }),
      partialize:
        customPartialize ||
        ((state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => !excludeFromPersist.includes(key as keyof T))
          ) as Partial<T>),
      ...(merge && { merge }),
      ...(version !== undefined && { version }),
      ...(migrate && { migrate }),
    })
  );
};

export type StoreState<T> = T extends { getState: () => infer S } ? S : never;

export type StoreActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};
