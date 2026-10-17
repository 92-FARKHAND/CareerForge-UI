'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { loadStoredUser } from '@/lib/auth/storage';
import { hydrateUser } from '@/lib/redux/slices/authSlice';
import { store } from '@/lib/redux/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // After a reload Redux starts empty. Restore who was signed in so the
    // UI (NavUser) can show it; whether the session is still valid is
    // decided separately by RequireAuth.
    const stored = loadStoredUser();
    if (stored) {
      store.dispatch(hydrateUser(stored));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
