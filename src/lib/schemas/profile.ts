import { z } from 'zod';

const experienceItemSchema = z.object({
  id: z.string(), // form-only key for list rendering; stripped before submit
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  location: z.string(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  description: z.string(),
  achievements: z.array(z.string()),
});

const educationItemSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, 'Degree is required'),
  location: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  graduationDate: z.string(),
  relevantCoursework: z.array(z.string()),
});

const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string(),
  date: z.string(),
});

const linksSchema = z.object({
  github: z.string(),
  linkedin: z.string(),
  portfolio: z.string(),
  other: z.array(z.string()),
});

export const profileReviewSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  currentRole: z.string(),
  yearsOfExperience: z
    .number({ error: 'Enter a number' })
    .min(0, 'Must be 0 or more')
    .max(60, "That's more years than anyone has"),
  // TODO: backend enum — confirmed value seen so far: "MID_LEVEL". Swap
  // this free-text field for a <Select> once the full ExperienceLevel
  // enum is shared.
  experienceLevel: z.string().min(1, 'Experience level is required'),
  summary: z.string().max(1000, 'Keep your summary under 1000 characters'),
  targetRole: z.string().min(1, 'Target role is required'),
  preferredCountry: z.string(),
  preferredCity: z.string(),
  // TODO: backend enum — confirmed value: "REMOTE".
  workMode: z.string().min(1, 'Work mode is required'),
  // TODO: backend enum — confirmed value: "CONTRACT".
  employmentType: z.string().min(1, 'Employment type is required'),
  skills: z.array(z.string().min(1)).min(1, 'Add at least one skill'),
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  certifications: z.array(certificationItemSchema),
  links: linksSchema,
});

export type ProfileReviewValues = z.infer<typeof profileReviewSchema>;
