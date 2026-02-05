import { Apple, Boxes, Ruler, Utensils } from 'lucide-react';
import type { RouteGroupType } from '@/app/(dashboard)/_types/nav';
import { Role } from '@/app/(dashboard)/_types/nav';
import { routes } from '@/lib/utils';

export const patterns = {
  zeroTo9999: /^(|0|0\.\d{0,2}|[1-9]\d{0,3}(\.\d{0,2})?)$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  minimumOneUpperCaseLetter: /[A-Z]/,
  minimumOneLowerCaseLetter: /[a-z]/,
  minimumOneDigit: /[0-9]/,
  minimumOneSpecialCharacter: /[@$!%*#?&]/,
  minEightCharacters: /^.{8,}$/,
};

export const nutritionalFields = [
  { name: 'calories', label: 'Calories', placeholder: 'kcal', type: 'number' },
  { name: 'protein', label: 'Protein', placeholder: 'grams', type: 'number' },
  {
    name: 'carbohydrates',
    label: 'Carbohydrates',
    placeholder: 'grams',
    type: 'number',
  },
  { name: 'fat', label: 'Fat', placeholder: 'grams', type: 'number' },
  { name: 'fiber', label: 'Fiber', placeholder: 'grams', type: 'number' },
  { name: 'sugar', label: 'Sugar', placeholder: 'grams', type: 'number' },
];

/**
 * Defines the navigation structure for the application, grouped by sections.
 * Each group has associated routes and roles that are allowed to access them.
 */
export const ROUTE_GROUPS = [
  {
    group: 'Foods Management',
    allowedRoles: [Role.ADMIN],
    items: [
      {
        href: routes.admin.foods,
        label: 'Foods',
        value: 'foods',
        icon: Apple,
      },
      {
        href: routes.admin.category,
        label: 'Categories',
        value: 'categories',
        icon: Boxes,
      },
      {
        href: routes.admin.servingUnits,
        label: 'Serving Units',
        value: 'serving-units',
        icon: Ruler,
      },
    ],
  },
  {
    group: 'Meals Management',
    allowedRoles: [Role.ADMIN, Role.CLIENT, Role.USER], // Admin can also access if needed
    items: [
      {
        href: routes.client,
        label: 'Meals',
        value: 'meals',
        icon: Utensils,
      },
    ],
  },
] as const satisfies RouteGroupType[];
