import { createListenerMiddleware } from '@reduxjs/toolkit';

import { clearStoredUser, saveStoredUser } from '@/lib/auth/storage';

import { resumeApi } from './api/resumeApi';
import { clearNewAccount, clearUser, setUser } from './slices/authSlice';

export const listenerMiddleware = createListenerMiddleware();

// Keep the on-device display user in step with auth state, from one place,
// no matter which code path signs the user in or out.
listenerMiddleware.startListening({
  actionCreator: setUser,
  effect: (action) => saveStoredUser(action.payload),
});
listenerMiddleware.startListening({
  actionCreator: clearUser,
  effect: () => clearStoredUser(),
});

// The first resume upload is the first time a new account has any data on
// the server, so from then on the normal "does it exist?" checks apply.
listenerMiddleware.startListening({
  matcher: resumeApi.endpoints.uploadResume.matchFulfilled,
  effect: (_action, api) => {
    api.dispatch(clearNewAccount());
  },
});
