import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { resumeApi } from '@/lib/redux/api/resumeApi';

import { clearUser } from './authSlice';

import type { ResumeVersion } from '@/lib/types/resume';

interface ProfileState {
  // Holds a just-uploaded resume version for immediate display on the
  // review screen, before GET /resumes/active (invalidated by the
  // upload) has refetched. The confirmed profile itself is no longer
  // duplicated here — read it from useGetProfileQuery() directly, which
  // RTK Query already keeps in sync (including across page reloads).
  draftResumeVersion: ResumeVersion | null;
}

const initialState: ProfileState = {
  draftResumeVersion: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setDraftResumeVersion: (state, action: PayloadAction<ResumeVersion | null>) => {
      state.draftResumeVersion = action.payload;
    },
  },
  // Never leak one user's draft into the next session: reset whenever
  // auth is cleared (manual logout, or a failed token refresh in baseApi).
  extraReducers: (builder) => {
    builder.addCase(clearUser, () => initialState);
    // If the resume the user was mid-review on gets deleted, drop the
    // draft so they can't try to confirm a version that no longer exists.
    builder.addMatcher(
      resumeApi.endpoints.deleteResume.matchFulfilled,
      (state, action) => {
        if (state.draftResumeVersion?.resumeId === action.meta.arg.originalArgs) {
          state.draftResumeVersion = null;
        }
      },
    );
  },
});

export const { setDraftResumeVersion } = profileSlice.actions;
export default profileSlice.reducer;
