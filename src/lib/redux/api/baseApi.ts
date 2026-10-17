import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import type { ApiResponse } from '@/lib/types';
import { clearUser } from '@/lib/redux/slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
prepareHeaders: (headers) => {
  return headers;
},

});

// Confirmed: the backend exposes POST /auth/refresh, and signin/signup set
// tokens as cookies. On a 401, try refreshing the access token once and
// retrying the original request before giving up — the standard RTK Query
// "automatic re-authentication" pattern. If refresh also fails, the
// session is genuinely over, so clear local auth state.
//
// This only refreshes an *expired* token. Restoring who is signed in after
// a hard reload is handled separately: RequireAuth checks GET /profile and
// the display user is restored from storage (see ReduxProvider).
let refreshInFlight: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // A 401 from sign-in/sign-up means bad credentials, not an expired
  // token — refreshing can't help, so don't spend a request on it.
  const requestUrl = typeof args === 'string' ? args : args.url;
  const isCredentialRequest =
    requestUrl.startsWith('/auth/signin') || requestUrl.startsWith('/auth/signup');

  if (result.error?.status === 401 && !isCredentialRequest) {
    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        const refreshResult = await rawBaseQuery(
          { url: '/auth/refresh', method: 'POST' },
          api,
          extraOptions,
        );
        return !refreshResult.error;
      })().finally(() => {
        refreshInFlight = null;
      });
    }

    const refreshed = await refreshInFlight;

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearUser());
    }
  }

  if (result.data && typeof result.data === 'object' && 'success' in result.data) {
    const apiResponse = result.data as ApiResponse<unknown>;

    if (!apiResponse.success) {
      const message =
        typeof apiResponse.error === 'string'
          ? apiResponse.error
          : 'Request failed';

      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: message,
          data: apiResponse.error,
        } satisfies FetchBaseQueryError,
      };
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Profile',
    'Resume',
    'Compatibility',
    'Learning',
    'Assessment',
    'Job',
  ],
  endpoints: () => ({}),
});
