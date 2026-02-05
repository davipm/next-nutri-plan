import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Configuration options for store creation
 * @template T - The store state type
 */
type StoreConfig<T> = {
  /**
   * Unique name for the store (required for persistence)
   * Used as the localStorage key and devtools identifier
   */
  name?: string;

  /**
   * Custom storage implementation (defaults to localStorage)
   * Can be sessionStorage, AsyncStorage, or any Storage-compatible API
   */
  storage?: Storage;

  /**
   * Skip persistence entirely - store will be memory-only
   * @default false
   */
  skipPersist?: boolean;

  /**
   * State keys to exclude from persistence
   * Useful for transient UI state like modals, loading states, etc.
   */
  excludeFromPersist?: Array<keyof T>;

  /**
   * DevTools configuration
   */
  devtools?: {
    /** Enable/disable devtools (auto-enabled in development) */
    enabled?: boolean;
    /** Custom devtools name (defaults to store name) */
    name?: string;
  };

  /**
   * Custom partialize function for fine-grained persistence control
   * If provided, overrides excludeFromPersist
   */
  partialize?: (state: T) => Partial<T>;

  /**
   * Merge function for hydrating persisted state
   * Useful for migrations or default value handling
   */
  merge?: (persistedState: unknown, currentState: T) => T;

  /**
   * Version number for migrations
   * Increment when making breaking changes to state structure
   */
  version?: number;

  /**
   * Migration function to transform old state versions
   */
  migrate?: (persistedState: unknown, version: number) => T | Promise<T>;
};

/**
 * Creates a Zustand store with immer, persistence, and devtools support
 *
 * @example
 * // Simple in-memory store
 * const useStore = createStore((set) => ({
 *   count: 0,
 *   increment: () => set((state) => { state.count += 1 })
 * }), { skipPersist: true });
 *
 * @example
 * // Persisted store with excluded keys
 * const useStore = createStore((set) => ({
 *   user: null,
 *   isLoading: false,
 *   setUser: (user) => set((state) => { state.user = user })
 * }), {
 *   name: 'user-store',
 *   excludeFromPersist: ['isLoading']
 * });
 */
export const createStore = <T extends object>(
  storeCreator: StateCreator<T, [['zustand/immer', never]], []>,
  config?: StoreConfig<T>,
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

  // Validate required config
  if (!skipPersist && !name) {
    throw new Error(
      'createStore: `config.name` is required when persistence is enabled. ' +
        'Set `skipPersist: true` for memory-only stores or provide a unique name.',
    );
  }

  // Apply immer middleware for immutable updates
  let enhancedStoreCreator = immer(storeCreator);

  // Apply devtools in development or when explicitly enabled
  const isDevtoolsEnabled =
    devtoolsConfig?.enabled ??
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

  if (isDevtoolsEnabled) {
    enhancedStoreCreator = devtools(enhancedStoreCreator, {
      name: devtoolsConfig?.name || name || 'zustand-store',
      enabled: true,
    }) as typeof enhancedStoreCreator;
  }

  // Return memory-only store if persistence is skipped
  if (skipPersist) {
    return create<T>()(enhancedStoreCreator);
  }

  // Create persisted store
  return create<T>()(
    persist(enhancedStoreCreator, {
      name: name!,
      storage: createJSONStorage(() => {
        if (storage) return storage;

        // Safe SSR check for localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage;
        }

        // Fallback for SSR environments
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
            Object.entries(state).filter(([key]) => !excludeFromPersist.includes(key as keyof T)),
          ) as Partial<T>),
      ...(merge && { merge }),
      ...(version !== undefined && { version }),
      ...(migrate && { migrate }),
    }),
  );
};

/**
 * Type helper to extract state from a store
 * @example
 * type UserState = StoreState<typeof useUserStore>;
 */
export type StoreState<T> = T extends { getState: () => infer S } ? S : never;

/**
 * Type helper to extract actions from a store
 * Filters out non-function properties
 */
export type StoreActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};
