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
 * with no information does a GET /profile. A successful response (including
 * a 404 converted to "no profile yet") still means signed in. A 401 or any
 * other error means stay on the auth page — never bounce a guest to
 * /dashboard.
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isKnownGuest = useAppSelector((state) => state.auth.isKnownGuest);

  const { isLoading, isSuccess, isUninitialized, isError } = useGetProfileQuery(
    undefined,
    { skip: isAuthenticated || isKnownGuest },
  );

  // Only a proven session belongs on /dashboard. A 404 is converted to
  // success (signed in, no profile yet). Network/500 errors are not.
  const confirmedAuthenticated = isAuthenticated || isSuccess;

  useEffect(() => {
    if (confirmedAuthenticated) {
      router.replace('/dashboard');
    }
  }, [confirmedAuthenticated, router]);

  if (confirmedAuthenticated) {
    return null;
  }

  if (!isKnownGuest && !isError && (isLoading || isUninitialized)) {
    // First load, still asking — avoid flashing the form at a signed-in user.
    return null;
  }

  return <>{children}</>;
}
