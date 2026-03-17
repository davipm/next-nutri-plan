'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Role } from '@/app/(dashboard)/_types/nav';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { getSession, signIn } from '@/lib/auth-client';

const signInSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type SignInSchema = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    const resetSensitiveFields = () => {
      form.resetField('password');
    };

    let didSucceed = false;

    try {
      await signIn.email(data, {
        onSuccess: () => {
          didSucceed = true;
          toast.success('Signed in successfully');
        },
        onError: ({ error }) => {
          toast.error(error.message);
          resetSensitiveFields();
        },
      });
    } catch {
      toast.error('Something went wrong. Please try again.');
      resetSensitiveFields();
    }

    if (!didSucceed) {
      return;
    }

    const sessionResponse = await getSession();
    const role = sessionResponse?.data?.user?.role;
    const route = role === Role.ADMIN ? '/admin/food-management/foods' : '/client';
    router.push(route);
  };

  return (
    <form
      className="w-full max-w-96 space-y-5 rounded-md border px-10 py-12"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="text-center">
        <h2 className="mb-1 font-semibold text-2xl">Welcome Back</h2>
        <p className="text-muted-foreground text-sm">Sign in to your account</p>
      </div>

      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                id={field.name}
                inputMode="email"
                placeholder="Email"
                spellCheck={false}
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <PasswordInput
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                id={field.name}
                placeholder="Password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        aria-busy={isSubmitting}
        className="w-full hover:cursor-pointer"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting && (
          <Loader2Icon aria-hidden="true" className="animate-spin" data-testid="loader-icon" />
        )}
        {isSubmitting && <span className="sr-only">Signing in</span>}
        Sign in
      </Button>

      <div className="text-center text-sm">
        Don&apos;t have an account?
        <Link className="ml-1 font-medium text-primary hover:underline" href="/sign-up">
          Sign up
        </Link>
      </div>
    </form>
  );
}
