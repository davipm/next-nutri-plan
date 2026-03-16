import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { DashboardLayout } from '@/app/(dashboard)/_components/dashboard-layout';
import { getSession } from '@/lib/auth-client';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session) {
    redirect('/sign-in');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
