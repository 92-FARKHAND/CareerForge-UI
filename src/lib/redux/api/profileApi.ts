import type { Profile } from '@/lib/types/resume';

import { baseApi } from './baseApi';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Confirmed: GET /profile. Doubles as the session check — RequireAuth
    // treats a 401 as "not logged in". A 404 just means "signed in, no
    // profile yet", which is a normal state, so it's returned as `null`
    // rather than an error.
    getProfile: builder.query<Profile | null, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('/profile');

        if (result.error) {
          return result.error.status === 404
            ? { data: null }
            : { error: result.error };
        }

        return { data: (result.data as Profile | null) ?? null };
      },
      providesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;
