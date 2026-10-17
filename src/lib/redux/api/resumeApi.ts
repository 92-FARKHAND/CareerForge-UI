import { normalizeResume } from '@/lib/mappers/resume';
import type {
  Resume,
  UploadResumeResponse,
  VerifyResumePayload,
  VerifyResumeResponse,
} from '@/lib/types/resume';
import { sortNewestFirst } from '@/lib/utils/sort';

import { baseApi } from './baseApi';

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Confirmed: POST /resumes, multipart field name "file"
    uploadResume: builder.mutation<UploadResumeResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: '/resumes',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Resume'],
    }),
    // Confirmed: PATCH /resumes/:resumeVersionId/verify
    verifyResume: builder.mutation<
      VerifyResumeResponse,
      { resumeVersionId: string; payload: VerifyResumePayload }
    >({
      query: ({ resumeVersionId, payload }) => ({
        url: `/resumes/${resumeVersionId}/verify`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Resume', 'Profile'],
    }),
    // Confirmed: GET /resumes/active. "No active resume" (404) is a normal
    // state and comes back as `null` — importantly this also overwrites any
    // previously cached resume, which an error would NOT (RTK Query keeps
    // the last good `data` on a failed refetch, so a deleted active resume
    // would otherwise keep showing).
    getActiveResume: builder.query<Resume | null, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('/resumes/active');

        if (result.error) {
          return result.error.status === 404
            ? { data: null }
            : { error: result.error };
        }

        return {
          data: result.data ? normalizeResume(result.data as Resume) : null,
        };
      },
      providesTags: [{ type: 'Resume', id: 'ACTIVE' }],
    }),
    // Confirmed: GET /resumes. Every resume comes back with its full
    // versions, so the list is also the data source for the detail view —
    // there is deliberately no GET /resumes/:id call.
    getResumes: builder.query<Resume[], void>({
      query: () => '/resumes',
      transformResponse: (resumes: Resume[]) =>
        sortNewestFirst((resumes ?? []).map(normalizeResume)),
      providesTags: [{ type: 'Resume', id: 'LIST' }],
    }),
    // DELETE /resumes/:id (the Resume id). The response body isn't used.
    deleteResume: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/resumes/${id}`,
        method: 'DELETE',
      }),
      // No refetch: drop the resume from the cached list directly. Only if
      // the deleted one was the ACTIVE resume does anything else change
      // (another may become active, the profile hangs off it), so only
      // then refetch.
      async onQueryStarted(id, { dispatch, queryFulfilled }): Promise<void> {
        try {
          await queryFulfilled;
        } catch {
          return;
        }

        const removed = { wasActive: false };
        dispatch(
          resumeApi.util.updateQueryData('getResumes', undefined, (draft) => {
            const index = draft.findIndex((resume) => resume.id === id);
            if (index !== -1) {
              removed.wasActive = draft[index].isActive;
              draft.splice(index, 1);
            }
          }),
        );

        if (removed.wasActive) {
          dispatch(
            resumeApi.util.invalidateTags([
              { type: 'Resume', id: 'LIST' },
              { type: 'Resume', id: 'ACTIVE' },
              'Profile',
            ]),
          );
        }
      },
    }),
  }),
});

export const {
  useUploadResumeMutation,
  useVerifyResumeMutation,
  useGetActiveResumeQuery,
  useGetResumesQuery,
  useDeleteResumeMutation,
} = resumeApi;
