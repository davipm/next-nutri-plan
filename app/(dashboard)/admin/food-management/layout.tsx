'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTE_GROUPS } from '@/lib/constants';

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const foodsGroup = ROUTE_GROUPS.find((group) => group.group === 'Foods Management');

  const tabsConfig = foodsGroup
    ? foodsGroup.items
        .filter((item) => item.icon)
        .map((item) => ({
          value: item.value,
          label: item.label,
          href: item.href,
          icon: item.icon,
        }))
    : [];

  const defaultTab = tabsConfig.find((tab) => pathname.startsWith(tab.href))?.value || 'foods';

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <Tabs value={defaultTab}>
          <TabsList>
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} asChild>
                  <Link href={tab.href as any} className="flex items-center justify-center gap-2">
                    <Icon />
                    {tab.label}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
