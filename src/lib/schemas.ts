import { z } from 'zod';

export const scoreBreakdownSchema = z.object({
    required_skills: z.number().int().min(0).max(60),
    experience_level: z.number().int().min(0).max(26),
    project_relevance: z.number().int().min(0).max(14),
});

export const analysisResultSchema = z.object({
    id: z
        .string()
        .uuid()
        .default(() => crypto.randomUUID()),
    score: z.number().int().min(0).max(100),
    score_breakdown: scoreBreakdownSchema,
    scoring_notes: z.string().nullable().optional(),
    strengths: z.array(z.string()).default([]),
    gaps: z.array(z.string()).default([]),
    suggestions: z.array(z.string()).default([]),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type ScoreBreakdown = z.infer<typeof scoreBreakdownSchema>;
