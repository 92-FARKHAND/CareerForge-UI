'use client';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AuthCredentials } from '@/lib/schemas/auth';

interface AuthCredentialsFieldsProps {
  register: UseFormRegister<AuthCredentials>;
  errors: FieldErrors<AuthCredentials>;
  disabled?: boolean;
  passwordAutoComplete?: 'current-password' | 'new-password';
}

export function AuthCredentialsFields({
  register,
  errors,
  disabled = false,
  passwordAutoComplete = 'current-password',
}: AuthCredentialsFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          disabled={disabled}
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete={passwordAutoComplete}
          placeholder="Enter your password"
          aria-invalid={Boolean(errors.password)}
          disabled={disabled}
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
    </>
  );
}
