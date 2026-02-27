import { useEffect, useState } from 'react';

/**
 * A custom hook that delays the update of a value until a specified delay has passed since the last change.
 *
 * @param {string} value - The input value that needs to be debounced.
 * @param {number} delay - The delay duration in milliseconds before updating the debounced value.
 * @returns The debounced value updated after the specified delay.
 */
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
};
