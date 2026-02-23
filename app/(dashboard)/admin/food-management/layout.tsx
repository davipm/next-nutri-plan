'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTE_GROUPS } from '@/lib/constants';

interface FoodManagementTab {
  value: string;
  label: string;
  href: string;
  icon: ReactNode;
}

function getTabsConfig(): FoodManagementTab[] {
  const foodsGroup = ROUTE_GROUPS.find((group) => group.group === 'Foods Management');

  if (!foodsGroup) {
    return [];
  }

  return foodsGroup.items
    .filter((item) => item.icon)
    .map((item) => ({
      value: item.value,
      label: item.label,
      href: String(item.href),
      icon: <item.icon className="size-4" />,
    }));
}

function getCurrentTab(pathname: string, tabs: FoodManagementTab[]): string {
  return tabs.find((tab) => pathname.startsWith(tab.href))?.value ?? 'foods';
}

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const tabsConfig = getTabsConfig();
  const currentTab = getCurrentTab(pathname, tabsConfig);

  if (tabsConfig.length === 0) {
    return <div className="mx-auto max-w-7xl p-6">{children}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <Tabs value={currentTab} orientation="horizontal">
          <TabsList>
            {tabsConfig.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} asChild>
                <Link href={tab.href as any} className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
