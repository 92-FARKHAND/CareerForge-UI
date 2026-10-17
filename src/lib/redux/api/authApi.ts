import type { AuthCredentialsRequest, AuthData } from '@/lib/types';

import { baseApi } from './baseApi';

// Confirmed: /auth/signup and /auth/signin both return `{ user: { id, email } }`
// directly — no envelope wrapper. See VerifyResumeDto/CompatibilityResponseDto
// examples too: this backend returns raw DTOs, not an ApiResponse<T> envelope.
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthData, AuthCredentialsRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
    signin: builder.mutation<AuthData, AuthCredentialsRequest>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
    }),
    // Confirmed route, response shape not shown. Tokens are set as cookies
    // by the backend (credentials: 'include' already sends them), so the
    // response body isn't needed by the caller — see baseApi's
    // baseQueryWithReauth, which calls this automatically on a 401.
    refreshToken: builder.mutation<unknown, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    // Confirmed route: /auth/signout. Assumed POST (like signin, signup
    // and refresh); the backend is expected to clear the auth cookies.
    // The response body isn't used.
    signout: builder.mutation<unknown, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
      }),
    }),
    changePassword: builder.mutation<
      unknown,
      { currentPassword: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useRefreshTokenMutation,
  useSignoutMutation,
  useChangePasswordMutation,
} = authApi;
