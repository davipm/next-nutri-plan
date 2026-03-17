'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { signUp } from '@/lib/auth-client';

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required.'),
    email: z.string().trim().min(1, 'Email is required.'),
    password: z.string().min(1, 'Password is required.'),
    confirmPassword: z.string().min(1, 'Confirm Password is required.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
type SignUpPayload = Omit<SignUpSchema, 'confirmPassword'>;

export function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    const { confirmPassword: _confirmPassword, ...payload } = data satisfies SignUpSchema;

    const resetSensitiveFields = () => {
      form.resetField('password');
      form.resetField('confirmPassword');
    };

    try {
      await signUp.email(payload satisfies SignUpPayload, {
        onSuccess: () => {
          toast.success('User Created Successfully');
          router.push('/sign-in');
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
  };

  return (
    <form
      className="w-full max-w-96 space-y-5 rounded-md border px-10 py-12"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="text-center">
        <h2 className="mb-1 font-semibold text-2xl">Create Account</h2>
        <p className="text-muted-foreground text-sm">Sign up to get started</p>
      </div>

      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="name"
                id={field.name}
                placeholder="Name"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
                autoComplete="new-password"
                id={field.name}
                placeholder="Password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <PasswordInput
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                id={field.name}
                placeholder="Password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button aria-busy={isSubmitting} className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <>
            <Loader2Icon aria-hidden="true" className="animate-spin" />
            <span className="sr-only">Signing up</span>
          </>
        ) : (
          'Sign up'
        )}
      </Button>

      <div className="text-center text-sm">
        Already have an account?
        <Link className="ml-1 font-medium text-primary hover:underline" href="/sign-in">
          Sign in
        </Link>
      </div>
    </form>
  );
}
