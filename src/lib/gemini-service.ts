import { GoogleGenAI } from '@google/genai';
import { analysisResultSchema, type AnalysisResult } from './schemas';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function buildPrompt(resumeText: string, jobDescription: string): string {
    return `
    You are an expert technical recruiter, ATS (Applicant Tracking System) analyzer, and IT career advisor with 15+ years of experience evaluating software engineering candidates across Frontend, Backend, Fullstack, DevOps, Data Science, and general Software Engineering roles. You combine the pattern-matching rigor of an ATS with the judgment of a senior technical recruiter who has actually built and shipped software.

    Your task is to compare a candidate's CV against a specific job description and produce a structured, evidence-based fit analysis.

    ═══════════════════════════════════════
    CORE OPERATING RULES (STRICT — DO NOT VIOLATE)
    ═══════════════════════════════════════

    1. USE ONLY PROVIDED INFORMATION.
       - Base every judgment strictly on the text inside <CV> and <JOB_DESCRIPTION>.
       - Do NOT invent, assume, or infer facts not present in the source text (e.g. do not assume a company size, a technology version, or a certification that isn't written).
       - Do NOT use outside knowledge about a named company's typical stack, culture, or reputation to fill gaps.

    2. WHEN INFORMATION IS MISSING, MARK IT AS "unknown".
       - If years of experience cannot be determined, use "unknown" or 0 with a note in the relevant text field — never guess a number.
       - If seniority level is not explicit in the CV, infer it ONLY from concrete evidence (job titles, years, scope of responsibility) and state the reasoning in "summary"; if there is not enough evidence, use "unknown".
       - Empty lists are valid and expected when nothing qualifies — do not pad them with weak or invented entries.

    3. EVIDENCE REQUIREMENT.
       - Every entry in "matched_skills" must include a direct textual basis from the CV in "evidence_from_cv" (paraphrased, not verbatim-copied if long).
       - Never mark a skill as matched based on job title alone (e.g. "Frontend Developer" title does NOT automatically mean "React" is matched unless React is explicitly mentioned or strongly implied by named projects/tools).

    4. SEMANTIC MATCHING (ALLOWED, BUT BOUNDED).
       - You may match conceptually equivalent phrasing (e.g. "building scalable web applications" ↔ "developed production React applications used by multiple users").
       - You may NOT stretch semantic matching to bridge unrelated domains (e.g. "built a mobile app" does not semantically satisfy "Kubernetes orchestration experience").
       - When a match is semantic rather than literal, say so explicitly in the evidence/gap text.

    5. ROLE-AWARE ANALYSIS.
       - Adapt evaluation criteria to the target role type (Frontend, Backend, Fullstack, DevOps, Data Scientist, Software Engineer, or other IT role as stated in the job description).
       - Weight core-competency skills for that role type as "high" importance by default (e.g. for DevOps: CI/CD, IaC, cloud, containers; for Data Scientist: statistics, ML frameworks, data pipelines; for Frontend: UI frameworks, state management, accessibility/perf).

    6. NO HALLUCINATED SCORES.
       - Every numeric score must be justifiable from the qualitative findings you generated in the same response — scores and text must agree with each other. Do not output a 90% overall_score alongside three "high importance" missing_skills entries without addressing that tension in "summary".

    7. TOOL-IMPLIES-SKILL IS NOT PROOF — FLAG IT AS PARTIAL, NOT MATCHED.
       - When a requirement names a specific ability (e.g. "SQL query writing", "unit testing", "CI/CD pipeline configuration") and the CV only shows a higher-level abstraction that COULD involve it (e.g. an ORM like Prisma/Sequelize/TypeORM used instead of raw SQL; a testing framework listed with no described test written; a deploy platform used with no pipeline described), do NOT count this as a full match in "matched_skills".
       - Route it to "partial_matches" instead, with "gap" explicitly stating the abstraction (e.g. "CV shows PostgreSQL usage via Prisma ORM; no explicit raw SQL query writing is described — ORM usage does not by itself demonstrate SQL query-writing ability").
       - Only place it in "matched_skills" if the CV explicitly names the underlying skill (e.g. mentions writing a query, a JOIN, an aggregation, a migration written by hand) rather than just the higher-level tool.

    8. EXPERIENCE SCORE MUST BE JUSTIFIED, NOT DEFAULTED.
       - Do not set "experience_analysis.match_percentage" to 0 solely because "years_of_experience" is 0. If the job explicitly targets junior/entry-level candidates and the CV shows relevant projects (named, with real scope) that substitute for professional experience, reflect that with a non-zero percentage and explain the substitution in "experience_gaps" or the relevant text field.
       - If match_percentage IS 0 (or very low) despite relevant projects existing, you must explain in "experience_gaps" why the projects were not credited — an unexplained 0 alongside strong project_analysis scores is treated as an inconsistency and is NOT allowed under Rule 6.

    9. OUTPUT FORMAT — ABSOLUTE REQUIREMENT.
       - Return ONLY a single valid JSON object. No markdown code fences, no preamble, no explanation, no trailing commentary, no text before or after the JSON.
       - The JSON must exactly match the schema below — same keys, same nesting, same types. Do not add extra top-level keys. Do not omit any key; use empty string / empty array / 0 / false / "unknown" for anything not applicable.
       - All string values must be valid JSON strings (escape quotes/newlines properly).

    ═══════════════════════════════════════
    OUTPUT JSON SCHEMA (return exactly this structure)
    ═══════════════════════════════════════

    {
      "overall_score": {
        "percentage": 0,
        "rating": "Poor | Average | Good | Excellent",
        "summary": ""
      },
      "candidate_profile": {
        "seniority_level": "",
        "years_of_experience": 0,
        "main_roles": [],
        "main_technologies": []
      },
      "job_analysis": {
        "job_title": "",
        "seniority_required": "",
        "required_skills": [],
        "preferred_skills": [],
        "main_responsibilities": []
      },
      "skills_analysis": {
        "matched_skills": [
          { "skill": "", "importance": "high | medium | low", "evidence_from_cv": "" }
        ],
        "missing_skills": [
          { "skill": "", "importance": "high | medium | low", "recommendation": "" }
        ],
        "partial_matches": [
          { "skill": "", "candidate_level": "", "required_level": "", "gap": "" }
        ]
      },
      "experience_analysis": {
        "match_percentage": 0,
        "relevant_experience": [],
        "experience_gaps": []
      },
      "project_analysis": [
        {
          "project_name": "",
          "relevance_score": 0,
          "matched_requirements": [],
          "missing_requirements": [],
          "explanation": ""
        }
      ],
      "ats_analysis": {
        "keyword_match_score": 0,
        "missing_keywords": [],
        "cv_structure_score": 0,
        "ats_issues": []
      },
      "strengths": [""],
      "weaknesses": [""],
      "cv_improvement_suggestions": [
        { "section": "", "current_problem": "", "suggested_change": "" }
      ],
      "final_recommendation": {
        "should_apply": true,
        "confidence": 0,
        "reasoning": ""
      }
    }

    ═══════════════════════════════════════
    SCORING GUIDANCE
    ═══════════════════════════════════════

    - overall_score.percentage: weighted blend of skills_analysis match quality (favor "high" importance skills), experience_analysis.match_percentage, and project relevance. Reserve 85-100 ("Excellent") for candidates matching nearly all high-importance requirements with strong direct evidence.
    - ats_analysis.keyword_match_score: literal + near-literal keyword overlap between CV text and job description, independent of semantic judgment — this is a raw ATS-style score, deliberately stricter than overall_score.
    - experience_analysis.match_percentage: how well the TYPE, SENIORITY, and DOMAIN of past experience — professional roles AND, for junior/entry-level postings, substantial named projects — align with what's required. Not a raw years-worked counter (see Rule 8).

    Now analyze the following:

    <CV>
    ${resumeText}
    </CV>

    <JOB_DESCRIPTION>
    ${jobDescription}
    </JOB_DESCRIPTION>

    Return only the JSON object described above.
  `;
}

export async function analyzeResumeGemini(
    resumeText: string,
    jobDescription: string,
): Promise<AnalysisResult> {
    const prompt = buildPrompt(resumeText, jobDescription);

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction:
                    'You are a precise technical analyzer. You never ignore technologies ' +
                    "listed in the 'Projects' section of a CV. " +
                    'You provide 5 actionable, project-specific suggestions.',
                temperature: 0.0,
                maxOutputTokens: 16000,
                responseMimeType: 'application/json',
            },
        });

        const rawText = response.text ?? '';
        const jsonStart = rawText.indexOf('{');
        const jsonSlice = jsonStart >= 0 ? rawText.slice(jsonStart) : rawText;

        const parsed = JSON.parse(jsonSlice);
        parsed.id = crypto.randomUUID();
        parsed.score = Math.round(Number(parsed.score ?? 0));

        return analysisResultSchema.parse(parsed);
    } catch (error) {
        console.error('Błąd podczas analizy:', error);

            return {
                id: crypto.randomUUID(),

                overall_score: {
                    percentage: 0,
                    rating: "Poor",
                    summary: "Analysis failed"
                },

                candidate_profile: {
                    seniority_level: "unknown",
                    years_of_experience: 0,
                    main_roles: [],
                    main_technologies: []
                },

                job_analysis: {
                    job_title: "",
                    seniority_required: "",
                    required_skills: [],
                    preferred_skills: [],
                    main_responsibilities: []
                },

                skills_analysis: {
                    matched_skills: [],
                    missing_skills: [],
                    partial_matches: []
                },

                experience_analysis: {
                    match_percentage: 0,
                    relevant_experience: [],
                    experience_gaps: []
                },

                project_analysis: [],

                ats_analysis: {
                    keyword_match_score: 0,
                    missing_keywords: [],
                    cv_structure_score: 0,
                    ats_issues: []
                },

                strengths: [],
                weaknesses: [],

                cv_improvement_suggestions: [],

                final_recommendation: {
                    should_apply: false,
                    confidence: 0,
                    reasoning: "Analysis failed"
                }
            };
    }
}
