'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { useGetProfileQuery } from '@/lib/redux/api/profileApi';
import { clearUser } from '@/lib/redux/slices/authSlice';

/**
 * Client-side guard for private routes.
 *
 * How it decides (cheapest check first):
 *  - Already signed in this tab, or a brand-new account -> render.
 *  - Known guest (logged out / failed refresh) -> /login, no request.
 *  - Otherwise (a hard reload) -> GET /profile. Only a successful
 *    response proves a session (404 is converted to success: signed in,
 *    no profile yet). A 401, network error, or any other failure is
 *    treated as logged out — never as a reason to show the dashboard.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isNewAccount = useAppSelector((state) => state.auth.isNewAccount);
  const isKnownGuest = useAppSelector((state) => state.auth.isKnownGuest);

  const { isSuccess, isError, error } = useGetProfileQuery(undefined, {
    skip: isAuthenticated || isNewAccount || isKnownGuest,
  });

  const isUnauthorized =
    isError && !!error && 'status' in error && error.status === 401;

  useEffect(() => {
    if (isUnauthorized) {
      dispatch(clearUser());
    }
  }, [isUnauthorized, dispatch]);

  const sessionConfirmed = isAuthenticated || isNewAccount || isSuccess;
  const sessionDenied =
    !sessionConfirmed && (isKnownGuest || isUnauthorized || isError);

  useEffect(() => {
    if (sessionDenied) {
      router.replace('/login');
    }
  }, [sessionDenied, router]);

  if (sessionDenied || !sessionConfirmed) {
    // Denied, uninitialized, or still loading — never flash protected UI.
    return null;
  }

  return <>{children}</>;
}
