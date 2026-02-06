import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/app/(dashboard)/_types/nav';
import { SignInForm } from '@/components/sign-in-form';
import { getSession } from '@/lib/auth-client';

export default async function Page() {
  const session = await getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (session?.user?.role === Role.ADMIN) {
    redirect('/admin/food-management/foods');
  }

  if (session?.user?.role === Role.USER) {
    redirect('/client');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInForm />
    </div>
  );
}
