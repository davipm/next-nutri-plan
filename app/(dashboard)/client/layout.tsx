import type { ReactNode } from 'react';

export default async function ClientLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl p-6">{children}</div>;
}
