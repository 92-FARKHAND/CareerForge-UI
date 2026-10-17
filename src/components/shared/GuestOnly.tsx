'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/lib/hooks/redux';
import { useGetProfileQuery } from '@/lib/redux/api/profileApi';

/**
 * Keeps signed-in users off the public auth pages (login/register).
 *
 * If we already know the answer (signed in this tab, or known to be
 * signed out) there's nothing to ask the server. Only a fresh page load
 * with no information does a GET /profile, so a signed-in user who
 * reloads /login still gets sent to /dashboard. Only a confirmed 401
 * counts as "actually a guest" — a 404 (signed in, no profile yet) or any
 * other error still means signed in.
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isKnownGuest = useAppSelector((state) => state.auth.isKnownGuest);

  const { isLoading, isSuccess, isError, error } = useGetProfileQuery(
    undefined,
    { skip: isAuthenticated || isKnownGuest },
  );

  const isUnauthorized =
    isError && !!error && 'status' in error && error.status === 401;
  const confirmedAuthenticated =
    isAuthenticated || isSuccess || (isError && !isUnauthorized);

  useEffect(() => {
    if (confirmedAuthenticated) {
      router.replace('/dashboard');
    }
  }, [confirmedAuthenticated, router]);

  if (confirmedAuthenticated) {
    return null;
  }

  if (!isKnownGuest && isLoading) {
    // First load, still asking — avoid flashing the form at a signed-in user.
    return null;
  }

  return <>{children}</>;
}
