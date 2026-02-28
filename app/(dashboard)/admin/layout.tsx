import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { getSession } from '@/lib/auth-client';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  // if (session.user?.role !== Role.ADMIN) redirect('/client');
  console.log(session?.user.role);

  return <div className="mx-auto max-w-7xl p-6">{children}</div>;
}
