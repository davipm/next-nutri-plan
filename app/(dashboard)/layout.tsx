// import { DashboardLayout } from '@/app/(dashboard)/_components/dashboard-layout';
//import { Role } from '@/app/(dashboard)/_types/nav';
// import { auth } from '@/lib/auth';
// import { routes } from '@/lib/utils';
import { headers } from 'next/headers';
// import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { auth } from '@/server/auth';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);

  // if (!session) redirect(routes.signIn);

  return <div>{children}</div>;
}
