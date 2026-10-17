'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthCredentialsFields } from '@/components/forms/AuthCredentialsFields';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppDispatch } from '@/lib/hooks/redux';
import { baseApi } from '@/lib/redux/api/baseApi';
import { markNewAccount, setUser } from '@/lib/redux/slices/authSlice';
import {
  authCredentialsSchema,
  type AuthCredentials,
} from '@/lib/schemas/auth';
import { getApiErrorMessage } from '@/lib/utils/api-error';

type AuthFormProps = {
  mode: 'signin' | 'signup';
  mutation: (values: AuthCredentials) => {
    unwrap: () => Promise<{
      user: Parameters<typeof setUser>[0];
    }>;
  };
  isLoading: boolean;
};

const config = {
  signin: {
    title: 'Welcome back',
    description: 'Sign in to continue to CareerForge AI.',
    submitLabel: 'Sign in',
    loadingLabel: 'Signing in...',
    errorMessage: 'Unable to sign in.',
    alternateText: "Don't have an account?",
    alternateLabel: 'Create one',
    alternateHref: '/register',
    passwordAutoComplete: 'current-password',
  },
  signup: {
    title: 'Create your account',
    description: 'Start with your email and a secure password.',
    submitLabel: 'Create account',
    loadingLabel: 'Creating account...',
    errorMessage: 'Unable to create your account.',
    alternateText: 'Already have an account?',
    alternateLabel: 'Sign in',
    alternateHref: '/login',
    passwordAutoComplete: 'new-password',
  },
} satisfies Record<
  AuthFormProps['mode'],
  {
    title: string;
    description: string;
    submitLabel: string;
    loadingLabel: string;
    errorMessage: string;
    alternateText: string;
    alternateLabel: string;
    alternateHref: string;
    passwordAutoComplete: 'current-password' | 'new-password';
  }
>;

export function AuthForm({
  mode,
  mutation,
  isLoading,
}: AuthFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthCredentials>({
    resolver: zodResolver(authCredentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const options = config[mode];
  const isBusy = isLoading || isSubmitting;

  async function onSubmit(values: AuthCredentials) {
    try {
      const response = await mutation(values).unwrap();

      dispatch(setUser(response.user));
      // A new identity: drop anything cached under the previous (logged
      // out) one — notably the 401 the login page's session check cached,
      // which would otherwise be read as "unauthorized" by the dashboard.
      dispatch(baseApi.util.resetApiState());
      if (mode === 'signup') {
        // Nothing can exist for a brand-new account, so don't go looking.
        dispatch(markNewAccount());
      }
      router.push('/dashboard');
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          options.errorMessage,
        ),
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>{options.title}</CardTitle>
        <CardDescription>{options.description}</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="mb-4 space-y-4">
          {errors.root ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {errors.root.message}
            </div>
          ) : null}

          <AuthCredentialsFields
            register={register}
            errors={errors}
            disabled={isBusy}
            passwordAutoComplete={options.passwordAutoComplete}
          />
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isBusy}
          >
            {isBusy ? options.loadingLabel : options.submitLabel}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {options.alternateText}{' '}
            <Link
              href={options.alternateHref}
              className="font-medium text-primary hover:underline"
            >
              {options.alternateLabel}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
