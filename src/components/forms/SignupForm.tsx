'use client';

import { AuthForm } from '@/components/forms/AuthForm';
import { useSignupMutation } from '@/lib/redux/api/authApi';

export function SignupForm() {
  const [signup, { isLoading }] = useSignupMutation();

  return (
    <AuthForm
      mode="signup"
      mutation={signup}
      isLoading={isLoading}
    />
  );
}
