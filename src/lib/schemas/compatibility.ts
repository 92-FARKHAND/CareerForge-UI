import { z } from 'zod';

export const compatibilityInputSchema = z.object({
  targetRole: z.string().min(1, 'Target role is required'),
  jobDescription: z
    .string()
    .min(50, 'Paste the full job description (at least 50 characters) for an accurate match')
    .max(8000, 'That\u2019s a lot of text — trim it to the core responsibilities and requirements'),
});

export type CompatibilityInputValues = z.infer<typeof compatibilityInputSchema>;
