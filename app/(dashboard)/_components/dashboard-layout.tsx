'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppSidebar } from '@/app/(dashboard)/_components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

type Props = {
  children: ReactNode;
};

export function DashboardLayout({ children }: Props) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.map((segment, index) => {
                  const href = `/${segments.slice(0, index + 1).join('/')}`;
                  const isLast = index === segments.length - 1;
                  const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                  return (
                    <div key={href} className="flex items-center gap-2">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
