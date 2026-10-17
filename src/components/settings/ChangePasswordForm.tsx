'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePasswordMutation } from '@/lib/redux/api/authApi';
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/lib/schemas/auth';
import { getApiErrorMessage } from '@/lib/utils/api-error';

const fields = [
  {
    name: 'currentPassword',
    label: 'Current password',
    autoComplete: 'current-password',
  },
  { name: 'password', label: 'New password', autoComplete: 'new-password' },
  {
    name: 'confirmPassword',
    label: 'Confirm new password',
    autoComplete: 'new-password',
  },
] as const;

export function ChangePasswordForm() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: ChangePasswordValues) {
    setSucceeded(false);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        password: values.password,
      }).unwrap();
      reset();
      setSucceeded(true);
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(error, 'Could not change your password.'),
      });
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          8–32 characters with an uppercase letter, a lowercase letter, a
          number, and a special character.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {errors.root ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {errors.root.message}
            </p>
          ) : null}
          {succeeded ? (
            <p
              role="status"
              className="rounded-lg border bg-muted px-3 py-2 text-sm"
            >
              Password updated.
            </p>
          ) : null}

          {fields.map(({ name, label, autoComplete }) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                type="password"
                autoComplete={autoComplete}
                aria-invalid={!!errors[name]}
                disabled={isLoading}
                {...register(name)}
              />
              {errors[name] ? (
                <p className="text-sm text-destructive">
                  {errors[name]?.message}
                </p>
              ) : null}
            </div>
          ))}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
