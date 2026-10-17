import type {
  AnalyzeCompatibilityPayload,
  CompatibilityHistoryItem,
  CompatibilityResult,
} from '@/lib/types/compatibility';
import { sortNewestFirst } from '@/lib/utils/sort';

import { baseApi } from './baseApi';

export const compatibilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Confirmed: POST /compatibility/:resumeVersionId/analyze
    analyzeCompatibility: builder.mutation<
      CompatibilityResult,
      { resumeVersionId: string; payload: AnalyzeCompatibilityPayload }
    >({
      query: ({ resumeVersionId, payload }) => ({
        url: `/compatibility/${resumeVersionId}/analyze`,
        method: 'POST',
        body: payload,
      }),
      // The new analysis is on the server now; refetch the history (if
      // it's currently loaded) so it appears.
      invalidatesTags: [{ type: 'Compatibility', id: 'LIST' }],
    }),
    // Confirmed: GET /compatibility — the flat history shape (see
    // CompatibilityHistoryItem). The backend returns oldest-first, so sort
    // newest-first once here. Each item already carries everything the
    // detail view shows, so there is deliberately no GET /compatibility/:id.
    getCompatibilityAnalyses: builder.query<CompatibilityHistoryItem[], void>({
      query: () => '/compatibility',
      transformResponse: (items: CompatibilityHistoryItem[]) =>
        sortNewestFirst(items ?? []),
      providesTags: [{ type: 'Compatibility', id: 'LIST' }],
    }),
    // DELETE /compatibility/:id — remove it from the cached history
    // directly instead of refetching the whole list.
    deleteCompatibilityAnalysis: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/compatibility/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }): Promise<void> {
        try {
          await queryFulfilled;
        } catch {
          return;
        }

        dispatch(
          compatibilityApi.util.updateQueryData(
            'getCompatibilityAnalyses',
            undefined,
            (draft) => {
              const index = draft.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            },
          ),
        );
      },
    }),
  }),
});

export const {
  useAnalyzeCompatibilityMutation,
  useGetCompatibilityAnalysesQuery,
  useDeleteCompatibilityAnalysisMutation,
} = compatibilityApi;
