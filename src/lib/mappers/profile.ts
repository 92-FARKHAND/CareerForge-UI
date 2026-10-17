import type {
  EducationItem,
  ExperienceItem,
  Profile,
  Resume,
  ResumeVersion,
  UploadResumeProfile,
  VerifyResumePayload,
} from '@/lib/types/resume';
import type {
  AnalyzeCompatibilityPayload,
  CompatibilityHistoryItem,
  CompatibilityResult,
} from '@/lib/types/compatibility';
import type { ProfileReviewValues } from '@/lib/schemas/profile';

let counter = 0;
function formKey(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

/**
 * Builds the review form's initial values from a resume version (from
 * GET /resumes/active or a fresh upload) and, if one already exists, the
 * verified profile. Profile-only fields (targetRole, preferredCountry,
 * etc.) fall back to empty until a profile exists.
 */
export function toProfileReviewValues(
  resumeVersion: ResumeVersion | null,
  profile?: Profile | null,
  options?: {
    // For a freshly uploaded (replacement) resume: let what was just
    // extracted win over the older saved profile for resume-derived
    // fields (name, skills). Preferences like target role always come
    // from the profile.
    preferResumeData?: boolean;
  },
): ProfileReviewValues {
  const resumeSkills = resumeVersion?.skills?.map((s) => s.name) ?? [];
  const preferResume = options?.preferResumeData ?? false;

  return {
    name: preferResume
      ? (resumeVersion?.name ?? profile?.name ?? '')
      : (profile?.name ?? resumeVersion?.name ?? ''),
    currentRole: profile?.currentRole ?? '',
    yearsOfExperience: profile?.yearsOfExperience ?? 0,
    experienceLevel: profile?.experienceLevel ?? '',
    summary: resumeVersion?.summary ?? '',
    targetRole: profile?.targetRole ?? '',
    preferredCountry: profile?.preferredCountry ?? '',
    preferredCity: profile?.preferredCity ?? '',
    workMode: profile?.workMode ?? '',
    employmentType: profile?.employmentType ?? '',
    skills:
      preferResume && resumeSkills.length > 0
        ? resumeSkills
        : (profile?.skills ?? resumeSkills),
    experience: (resumeVersion?.experience ?? []).map((exp) => ({
      id: formKey('exp'),
      company: exp.company,
      jobTitle: exp.jobTitle,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      achievements: exp.achievements ?? [],
    })),
    education: (resumeVersion?.education ?? []).map((edu) => ({
      id: formKey('edu'),
      degree: edu.degree,
      location: edu.location,
      institution: edu.institution,
      fieldOfStudy: edu.fieldOfStudy,
      graduationDate: edu.graduationDate,
      relevantCoursework: edu.relevantCoursework ?? [],
    })),
    certifications: (resumeVersion?.certifications ?? []).map((cert) => ({
      id: formKey('cert'),
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
    })),
    links: {
      github: resumeVersion?.links?.github ?? '',
      linkedin: resumeVersion?.links?.linkedin ?? '',
      portfolio: resumeVersion?.links?.portfolio ?? '',
      other: resumeVersion?.links?.other ?? [],
    },
  };
}

/** The most recent version on a GET /resumes or GET /resumes/active Resume. */
export function latestResumeVersion(resume: Resume): ResumeVersion | null {
  return resume.versions[0] ?? null;
}

/**
 * Converts the POST /resumes upload response's simplified "preview" shape
 * (title/field, no achievements/coursework/ids) into the same
 * ResumeVersion shape GET /resumes/active returns, so the rest of the app
 * — the review form, toProfileReviewValues above — only has to deal with
 * one shape. Fields the preview doesn't have (achievements,
 * relevantCoursework, graduationDate, rawText, skill ids) are left empty
 * for the user to fill in on the review screen.
 */
export function fromUploadResumeProfile(
  resumeId: string,
  versionId: string,
  status: string,
  data: UploadResumeProfile,
): ResumeVersion {
  return {
    id: versionId,
    resumeId,
    status,
    rawText: '',
    name: data.name,
    summary: data.summary,
    experience: data.experience.map((exp) => ({
      company: exp.company ?? '',
      jobTitle: exp.title ?? '',
      location: exp.location ?? '',
      startDate: exp.startDate ?? '',
      endDate: exp.endDate,
      description: exp.description ?? '',
      achievements: [],
    })),
    education: data.education.map((edu) => ({
      degree: edu.degree ?? '',
      location: '',
      institution: edu.institution ?? '',
      fieldOfStudy: edu.field ?? '',
      // The preview has start/end dates instead of a single graduation
      // date — best-effort derive one; the user can correct it below.
      graduationDate: edu.endDate ?? edu.startDate ?? '',
      relevantCoursework: [],
    })),
    projects: data.projects,
    certifications: data.certifications,
    links: data.links,
    failureReason: null,
    createdAt: new Date().toISOString(),
    skills: data.skills.map((skill) => ({
      id: formKey('skill'),
      resumeVersionId: versionId,
      name: skill.name,
      category: skill.category ?? null,
      proficiencyGuess: skill.proficiencyGuess ?? null,
    })),
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Builds the PATCH /resumes/:id/verify request body from form values. */
export function toVerifyResumePayload(
  values: ProfileReviewValues,
): VerifyResumePayload {
  const experience: ExperienceItem[] = values.experience.map((exp) => ({
    company: exp.company,
    jobTitle: exp.jobTitle,
    location: exp.location,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    achievements: exp.achievements,
  }));

  const education: EducationItem[] = values.education.map((edu) => ({
    degree: edu.degree,
    location: edu.location,
    institution: edu.institution,
    fieldOfStudy: edu.fieldOfStudy,
    graduationDate: edu.graduationDate,
    relevantCoursework: edu.relevantCoursework,
  }));

  return {
    name: values.name,
    currentRole: values.currentRole,
    yearsOfExperience: values.yearsOfExperience,
    experienceLevel: values.experienceLevel,
    summary: values.summary,
    experience,
    education,
    skills: values.skills.map((name) => ({ name })),
    certifications: values.certifications.map((cert) => ({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
    })),
    links: {
      github: emptyToNull(values.links.github),
      linkedin: emptyToNull(values.links.linkedin),
      portfolio: emptyToNull(values.links.portfolio),
      other: values.links.other,
    },
    // Not built in the review form yet — real field shapes unconfirmed.
    projects: [],
    awards: [],
    languages: [],
    targetRole: values.targetRole,
    preferredCountry: values.preferredCountry,
    preferredCity: values.preferredCity,
    workMode: values.workMode,
    employmentType: values.employmentType,
  };
}

/**
 * Builds the POST /compatibility/:id/analyze request body: the same
 * verified-profile payload plus a job description, with the option to
 * target a different role for this specific analysis than what's saved
 * on the profile.
 */
export function toAnalyzeCompatibilityPayload(
  values: ProfileReviewValues,
  overrides: { targetRole?: string; jobDescription: string },
): AnalyzeCompatibilityPayload {
  return {
    ...toVerifyResumePayload(values),
    targetRole: overrides.targetRole?.trim() || values.targetRole,
    jobDescription: overrides.jobDescription,
  };
}

/**
 * Converts a GET /compatibility history item (flat scores, no skills[])
 * into the canonical nested CompatibilityResult shape, so
 * CompatibilityResultView can render either a fresh analysis or a
 * history item with no special-casing.
 */
export function fromCompatibilityHistoryItem(
  item: CompatibilityHistoryItem,
): CompatibilityResult {
  return {
    id: item.id,
    resumeVersionId: item.resumeVersionId,
    targetRole: item.targetRole,
    jobDescription: item.jobDescription,
    status: item.status,
    failureReason: item.failureReason,
    scores: {
      overall: item.overallScore,
      technical: item.technicalScore,
      experience: item.experienceScore,
      projects: item.projectsScore,
      tools: item.toolsScore,
      roleAlignment: item.roleAlignmentScore,
      education: item.educationScore,
    },
    readinessLevel: item.readinessLevel,
    // The history endpoint doesn't return per-skill matches.
    skills: [],
    strengths: item.strengths,
    weaknesses: item.weaknesses,
    recommendations: item.recommendations,
    meta: {
      aiProvider: item.aiProvider,
      aiModel: item.aiModel,
      promptVersion: item.promptVersion,
      scoringConfigVersion: item.scoringConfigVersion,
    },
    createdAt: item.createdAt,
  };
}
