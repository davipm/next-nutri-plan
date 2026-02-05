'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Role } from '@/app/(dashboard)/_types/nav';
import { ControlledInput } from '@/components/controlled-input';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from '@/lib/auth-client';

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type SignInSchema = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { isPending, data: session } = useSession();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<SignInSchema> = async (data: SignInSchema) => {
    await signIn.email(data, {
      onSuccess: () => {
        const route =
          session?.user?.role === Role.ADMIN ? '/admin/food-management/foods' : '/client';
        toast.success(`Logged as ${session?.user}`);
        router.push(route);
      },
      onError: ({ error }) => {
        toast.error(error.message);
        form.reset();
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-96 space-y-5 rounded-md border px-10 py-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h2 className="mb-1 text-2xl font-semibold">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        <div className="space-y-3">
          <ControlledInput<SignInSchema> name="email" label="Email" />
          <ControlledInput<SignInSchema> name="password" label="Password" type="password" />
        </div>

        <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
          {isPending && (
            <Loader2Icon className="animate-spin" aria-hidden="true" data-testid="loader-icon" />
          )}
          Sign in
        </Button>

        <div className="text-center text-sm">
          Don&apos;t have an account?
          <Link href="/sign-up" className="text-primary ml-1 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
