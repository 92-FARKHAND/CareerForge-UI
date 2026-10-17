import type { Resume } from '@/lib/types/resume';


/**
 * Makes a Resume safe to render: guarantees `versions` is an array and
 * sorts it newest-first, so `versions[0]` really is the latest version
 * everywhere in the app (the backend's ordering isn't documented).
 */
export function normalizeResume(resume: Resume): Resume {
  const versions = [...(resume.versions ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return { ...resume, versions };
}
