import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toStringSafe = (value: unknown): string => {
  return value === null ? '' : String(value);
};

export const toNumberSafe = (value: unknown): number => {
  if (value === null) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const routes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  client: '/client',
  admin: {
    category: '/admin/food-management/categories',
    foods: '/admin/food-management/foods',
    servingUnits: '/admin/food-management/serving-units',
  },
};
