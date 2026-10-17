import { useAppSelector } from '@/lib/hooks/redux';
import { useGetCompatibilityAnalysesQuery } from '@/lib/redux/api/compatibilityApi';
import { useGetProfileQuery } from '@/lib/redux/api/profileApi';
import {
  useGetActiveResumeQuery,
  useGetResumesQuery,
} from '@/lib/redux/api/resumeApi';

/**
 * The account-data queries, wrapped so every screen follows the same rule:
 * a brand-new account (just signed up, nothing uploaded yet) cannot have a
 * profile, resumes or compatibility history, so none of these requests are
 * made until it has created something. Use these instead of the raw
 * generated hooks anywhere inside the dashboard.
 */
function useIsNewAccount(): boolean {
  return useAppSelector((state) => state.auth.isNewAccount);
}

export function useProfile() {
  const skip = useIsNewAccount();
  return useGetProfileQuery(undefined, { skip });
}

export function useActiveResume() {
  const skip = useIsNewAccount();
  return useGetActiveResumeQuery(undefined, { skip });
}

export function useResumes() {
  const skip = useIsNewAccount();
  return useGetResumesQuery(undefined, { skip });
}

export function useCompatibilityHistory(options?: { skip?: boolean }) {
  const isNewAccount = useIsNewAccount();
  return useGetCompatibilityAnalysesQuery(undefined, {
    skip: isNewAccount || options?.skip,
  });
}
