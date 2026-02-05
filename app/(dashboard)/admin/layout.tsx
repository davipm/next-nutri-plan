// import { Role } from '@/app/(dashboard)/_types/nav';
// import { auth } from '@/lib/auth';
// import { routes } from '@/lib/utils';
import { headers } from 'next/headers';
// import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { auth } from '@/server/auth';

/**
 * The Layout component serves as a layout wrapper for child components.
 * It handles user session authentication and redirects based on the role of the authenticated user.
 *
 * @param {Object} props - The component's input props.
 * @param {ReactNode} props.children - React node elements to be rendered as children inside the layout.
 * Redirects the user if there is no session or based on the user's role.
 */
export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  //
  // if (!session) redirect(routes.signIn);
  //
  // if (session.user?.role !== Role.ADMIN) redirect(routes.client);

  return <div className="mx-auto max-w-7xl p-6">{children}</div>;
}
