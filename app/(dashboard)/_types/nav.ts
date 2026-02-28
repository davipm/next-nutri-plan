import type { ComponentType } from 'react';

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  USER = 'user',
}

export interface RouteItemType {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export interface RouteGroupType {
  allowedRoles: Role[];
  group: string;
  items: RouteItemType[];
}
