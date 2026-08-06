import { z } from "zod";

const importanceSchema = z.enum([
  "high",
  "medium",
  "low",
]);

const ratingSchema = z.enum([
  "Poor",
  "Average",
  "Good",
  "Excellent",
]);

/**
 * Overall score
 */
export const overallScoreSchema = z.object({
  percentage: z.number().min(0).max(100),
  rating: ratingSchema,
  summary: z.string(),
});


/**
 * Candidate profile
 */
export const candidateProfileSchema = z.object({
  seniority_level: z.string(),
  years_of_experience: z.number().min(0),
  main_roles: z.array(z.string()).default([]),
  main_technologies: z.array(z.string()).default([]),
});


/**
 * Job skills
 * Used in required_skills / preferred_skills
 */
export const jobSkillSchema = z.object({
  skill: z.string(),
  importance: importanceSchema,
});


/**
 * Job analysis
 */
export const jobAnalysisSchema = z.object({
  job_title: z.string(),

  seniority_required: z.string(),

  required_skills: z
    .array(jobSkillSchema)
    .default([]),

  preferred_skills: z
    .array(jobSkillSchema)
    .default([]),

  main_responsibilities: z
    .array(z.string())
    .default([]),
});


/**
 * Skills analysis
 */
export const matchedSkillSchema = z.object({
  skill: z.string(),
  importance: importanceSchema,
  evidence_from_cv: z.string(),
});


export const missingSkillSchema = z.object({
  skill: z.string(),
  importance: importanceSchema,
  recommendation: z.string(),
});


export const partialMatchSchema = z.object({
  skill: z.string(),
  candidate_level: z.string(),
  required_level: z.string(),
  gap: z.string(),
});


export const skillsAnalysisSchema = z.object({
  matched_skills: z
    .array(matchedSkillSchema)
    .default([]),

  missing_skills: z
    .array(missingSkillSchema)
    .default([]),

  partial_matches: z
    .array(partialMatchSchema)
    .default([]),
});


/**
 * Experience
 */
export const experienceAnalysisSchema = z.object({
  match_percentage: z.number().min(0).max(100),

  relevant_experience: z
    .array(z.string())
    .default([]),

  experience_gaps: z
    .array(z.string())
    .default([]),
});


/**
 * Projects
 */
export const projectAnalysisSchema = z.object({
  project_name: z.string(),

  relevance_score: z
    .number()
    .min(0)
    .max(100),

  matched_requirements: z
    .array(z.string())
    .default([]),

  missing_requirements: z
    .array(z.string())
    .default([]),

  explanation: z.string(),
});


/**
 * ATS
 */
export const atsAnalysisSchema = z.object({
  keyword_match_score: z
    .number()
    .min(0)
    .max(100),

  missing_keywords: z
    .array(z.string())
    .default([]),

  cv_structure_score: z
    .number()
    .min(0)
    .max(100),

  ats_issues: z
    .array(z.string())
    .default([]),
});


/**
 * CV improvements
 */
export const cvImprovementSuggestionSchema = z.object({
  section: z.string(),

  current_problem: z.string(),

  suggested_change: z.string(),
});


/**
 * Recommendation
 */
export const finalRecommendationSchema = z.object({
  should_apply: z.boolean(),

  confidence: z
    .number()
    .min(0)
    .max(100),

  reasoning: z.string(),
});


/**
 * Main response
 */
export const analysisResultSchema = z.object({

  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),


  overall_score: overallScoreSchema,


  candidate_profile: candidateProfileSchema,


  job_analysis: jobAnalysisSchema,


  skills_analysis: skillsAnalysisSchema,


  experience_analysis: experienceAnalysisSchema,


  project_analysis: z
    .array(projectAnalysisSchema)
    .default([]),


  ats_analysis: atsAnalysisSchema,


  strengths: z
    .array(z.string())
    .default([]),


  weaknesses: z
    .array(z.string())
    .default([]),


  cv_improvement_suggestions: z
    .array(cvImprovementSuggestionSchema)
    .default([]),


  final_recommendation: finalRecommendationSchema,
});


export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export type OverallScore = z.infer<typeof overallScoreSchema>;

export type SkillsAnalysis = z.infer<typeof skillsAnalysisSchema>;

export type ProjectAnalysis = z.infer<typeof projectAnalysisSchema>;
