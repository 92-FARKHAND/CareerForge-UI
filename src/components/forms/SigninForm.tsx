'use client';

import { AuthForm } from '@/components/forms/AuthForm';
import { useSigninMutation } from '@/lib/redux/api/authApi';

export function SigninForm() {
  const [signin, { isLoading }] = useSigninMutation();

  return (
    <AuthForm
      mode="signin"
      mutation={signin}
      isLoading={isLoading}
    />
  );
}
