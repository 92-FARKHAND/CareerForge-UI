/**
 * Resume/profile domain types.
 *
 * Two distinct shapes exist on the backend for "a resume's extracted
 * content", confirmed from real examples:
 *  1. The PATCH /resumes/:id/verify request/response and GET /resumes,
 *     GET /resumes/active — the rich shape (jobTitle, achievements,
 *     fieldOfStudy, relevantCoursework, graduationDate). This is the
 *     canonical shape used everywhere in the app except the upload
 *     response itself.
 *  2. The POST /resumes upload response's embedded "profile" preview —
 *     a simpler shape (title, field, no achievements/coursework). See
 *     UploadResumeProfile and the `fromUploadResumeProfile` mapper in
 *     src/lib/mappers/profile.ts, which converts #2 into #1 so the rest
 *     of the app only has to deal with one shape.
 */

export type ExperienceLevel = string; // seen: "MID_LEVEL"
export type WorkMode = string; // seen: "REMOTE", "ONSITE"
export type EmploymentType = string; // seen: "CONTRACT"

export interface ExperienceItem {
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements?: string[];
}

export interface EducationItem {
  degree: string;
  location: string;
  institution: string;
  fieldOfStudy: string;
  graduationDate: string;
  relevantCoursework?: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeLinks {
  other: string[];
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

/** Shapes referenced by the backend but only ever seen as empty arrays —
 * no UI is built for these until a real example shows their fields. */
export type ProjectItem = Record<string, unknown>;
export type AwardItem = Record<string, unknown>;
export type LanguageItem = Record<string, unknown>;

/** A skill as sent in the verify/analyze payload. */
export interface ExtractedSkill {
  name: string;
  category?: string | null;
  proficiencyGuess?: string | null;
}

/** A skill as it comes back on a persisted ResumeVersion (has a real id). */
export interface ResumeVersionSkill {
  id: string;
  resumeVersionId: string;
  name: string;
  category: string | null;
  proficiencyGuess: string | null;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | string;
  rawText: string;
  name: string | null;
  summary: string | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  links: ResumeLinks;
  failureReason: string | null;
  createdAt: string;
  skills: ResumeVersionSkill[];
}

/** GET /resumes and GET /resumes/active — a resume file plus its versions. */
export interface Resume {
  id: string;
  userId: string;
  storageProvider: string;
  storageKey: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  status: 'UPLOADED' | 'PARSED' | 'FAILED' | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  versions: ResumeVersion[];
}

/** GET /profile */
export interface Profile {
  id: string;
  userId: string;
  name: string | null;
  experienceLevel: ExperienceLevel | null;
  yearsOfExperience: number | null;
  education: string | null;
  currentRole: string | null;
  targetRole: string | null;
  skills: string[];
  preferredCountry: string | null;
  preferredCity: string | null;
  workMode: WorkMode | null;
  employmentType: EmploymentType | null;
  createdAt: string;
  updatedAt: string;
}

/** Request body for PATCH /resumes/:resumeVersionId/verify */
export interface VerifyResumePayload {
  name?: string;
  currentRole?: string;
  yearsOfExperience?: number;
  experienceLevel?: ExperienceLevel;
  summary?: string | null;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: ExtractedSkill[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  links?: ResumeLinks;
  awards?: AwardItem[];
  languages?: LanguageItem[];
  targetRole?: string;
  preferredCountry?: string;
  preferredCity?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
}

export interface VerifyResumeResponse {
  profile: Profile;
  resumeVersion: ResumeVersion;
}

// ---------------------------------------------------------------------
// POST /resumes upload response — confirmed shape (tested against the
// real backend): an ApiResponse-style envelope, unlike every other
// endpoint in this app, with a simplified "preview" of the extraction,
// not the full rich shape above.
// ---------------------------------------------------------------------

export interface UploadExperiencePreview {
  title: string | null;
  company: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface UploadEducationPreview {
  institution: string | null;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface UploadResumeProfile {
  name: string | null;
  summary: string | null;
  experience: UploadExperiencePreview[];
  education: UploadEducationPreview[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  links: ResumeLinks;
  skills: ExtractedSkill[];
}

export interface UploadResumeResponse {
  success: boolean;
  data: {
    resumeId: string;
    versionId: string;
    status: string;
    profile: UploadResumeProfile;
  };
  meta: unknown;
  error: unknown;
}
