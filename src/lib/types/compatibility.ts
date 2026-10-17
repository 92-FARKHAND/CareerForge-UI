/**
 * Compatibility domain types.
 *
 * Two distinct shapes, confirmed from real examples:
 *  1. POST /compatibility/:resumeVersionId/analyze response — nested
 *     `scores`/`meta`, includes a per-skill `skills[]` match list.
 *  2. GET /compatibility (history) response — the same analysis, but
 *     flat (`overallScore`, `technicalScore`, ... and `aiProvider`,
 *     `aiModel`, ... all top-level) and with no `skills[]` at all.
 * CompatibilityResult (#1) is the canonical shape the UI renders with;
 * `fromCompatibilityHistoryItem` in src/lib/mappers/profile.ts converts
 * #2 into #1 so CompatibilityResultView only has to handle one shape.
 */

import type { VerifyResumePayload } from './resume';

/** Request body for POST /compatibility/:resumeVersionId/analyze */
export interface AnalyzeCompatibilityPayload extends VerifyResumePayload {
  jobDescription?: string | null;
}

export interface CompatibilityScores {
  overall: number | null;
  technical: number | null;
  experience: number | null;
  projects: number | null;
  tools: number | null;
  roleAlignment: number | null;
  education: number | null;
}

export interface CompatibilitySkillMatch {
  skillName: string;
  // Confirmed value: "MATCHED". Other values (e.g. a "MISSING" or
  // "PARTIAL" match type) aren't confirmed yet.
  matchType: string;
}

export interface CompatibilityMeta {
  aiProvider: string | null;
  aiModel: string | null;
  promptVersion: string | null;
  scoringConfigVersion: string | null;
}

/** Canonical UI-facing shape — what CompatibilityResultView renders. */
export interface CompatibilityResult {
  id: string;
  resumeVersionId: string;
  targetRole: string | null;
  jobDescription: string | null;
  status: string;
  failureReason: string | null;
  scores: CompatibilityScores;
  readinessLevel: string | null;
  skills: CompatibilitySkillMatch[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  meta: CompatibilityMeta;
  createdAt: string;
}

/** GET /compatibility list item — the real, flat, confirmed shape. */
export interface CompatibilityHistoryItem {
  id: string;
  userId: string;
  resumeVersionId: string;
  targetRole: string | null;
  jobDescription: string | null;
  status: string;
  failureReason: string | null;
  overallScore: number | null;
  technicalScore: number | null;
  experienceScore: number | null;
  projectsScore: number | null;
  toolsScore: number | null;
  roleAlignmentScore: number | null;
  educationScore: number | null;
  readinessLevel: string | null;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  aiProvider: string | null;
  aiModel: string | null;
  promptVersion: string | null;
  scoringConfigVersion: string | null;
  createdAt: string;
}
