import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
