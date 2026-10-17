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
 *  - We already know there's no session (logged out, or a failed token
 *    refresh)  -> redirect to /login, no request.
 *  - We just signed in/up in this tab -> render immediately; the session
 *    is proven by the response we just got.
 *  - Otherwise (a hard reload) -> GET /profile. A 401 means the cookie is
 *    really gone; anything else, including a 404 for a user with no
 *    profile yet, means the session is valid.
 *
 * A new account skips the GET entirely: it just proved its session by
 * signing up, and has no profile to look for.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isNewAccount = useAppSelector((state) => state.auth.isNewAccount);
  const isKnownGuest = useAppSelector((state) => state.auth.isKnownGuest);

  const { isLoading, isError, error } = useGetProfileQuery(undefined, {
    skip: isNewAccount || isKnownGuest,
  });

  const isUnauthorized =
    isError && !!error && 'status' in error && error.status === 401;

  useEffect(() => {
    if (isUnauthorized) {
      dispatch(clearUser());
    }
  }, [isUnauthorized, dispatch]);

  useEffect(() => {
    if (isKnownGuest && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isKnownGuest, isAuthenticated, router]);

  if (isKnownGuest || isUnauthorized) {
    return null;
  }

  if (!isAuthenticated && isLoading) {
    // A reload with no answer from the server yet — don't flash protected
    // content.
    return null;
  }

  return <>{children}</>;
}
