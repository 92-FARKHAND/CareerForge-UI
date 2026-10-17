import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  // True once we have positive proof of a session (a sign-in/up in this
  // tab). Not persisted — after a reload, RequireAuth re-proves it with
  // GET /profile.
  isAuthenticated: boolean;
  // True from sign-up until the account first creates data (uploads a
  // resume). A brand-new account can't have a profile, resumes or
  // compatibility history, so those GETs are skipped entirely.
  isNewAccount: boolean;
  // True once we KNOW there is no session (after logout, or a failed
  // token refresh). Lets /login render instantly and lets RequireAuth
  // redirect without making a request that is certain to 401.
  isKnownGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isNewAccount: false,
  isKnownGuest: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isKnownGuest = false;
    },
    // Restores the display user (id + email) saved on this device after a
    // reload. Deliberately does NOT mark the session as authenticated —
    // only the server can confirm that.
    hydrateUser: (state, action: PayloadAction<User>) => {
      if (!state.user) {
        state.user = action.payload;
      }
    },
    markNewAccount: (state) => {
      state.isNewAccount = true;
    },
    clearNewAccount: (state) => {
      state.isNewAccount = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isNewAccount = false;
      state.isKnownGuest = true;
    },
  },
});

export const { setUser, hydrateUser, markNewAccount, clearNewAccount, clearUser } =
  authSlice.actions;
export default authSlice.reducer;
