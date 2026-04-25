import json
import os
import re
import logging
import google.generativeai as genai
from dotenv import load_dotenv
from models.schemas import AnalysisResult

load_dotenv()

logger = logging.getLogger(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config={"temperature": 0.3, "max_output_tokens": 8000}
)


def analyze_resume_gemini(resume_text: str, job_description: str) -> dict:
    """Wysyła CV i ogłoszenie do Gemini API i zwraca zwalidowaną analizę."""

    prompt = f"""
    You are a senior tech recruiter. Score objectively — no inflation, no deflation.

    CV: {resume_text}
    JOB POSTING: {job_description}

    --- STEP 0: EXTRACT REQUIREMENTS ---
    From the job posting, extract:
    - JOB_LEVEL: is this entry-level/junior? (look for: "junior", "pierwsza praca",
      "bez doświadczenia", no minimum years stated → set to JUNIOR, otherwise SENIOR)
    - PRIMARY_STACK: the main language/framework (listed first or with min. years required).
      If the job requires multiple core technologies together (e.g. React + Node.js),
      treat them as ONE combined stack. A project qualifies if it contains ANY of the
      PRIMARY_STACK technologies.
    - MUST_HAVE_TECHS: required technical skills from the REQUIREMENTS section only.
      Do NOT include language proficiency (e.g. "język angielski", "English").
    - MUST_HAVE_PRACTICES: engineering practices from the section explicitly labeled as
      requirements (e.g. "Nasze wymagania", "Requirements", "We require") only.
      If "code review", "unit testing", or similar appears ONLY in the duties/
      responsibilities section, do NOT include it here.
    - NICE_TO_HAVES: optional/bonus technical skills

    --- STEP 1: CRITICAL RULE CHECK ---
    If PRIMARY_STACK technology has NO named project proof in CV:
      → S1 is CAPPED at 20/60. Skip normal S1 calculation.
      → S3 is CAPPED at 7/14. Candidate's projects cannot score "exact stack match"
        when primary stack has no proof.
      → Note cap reason internally.

    If PRIMARY_STACK has project proof → proceed to normal S1 and S3 calculation below.

    --- SCORING (total 100 pts) ---

    [S1] Required skills — 60 pts (skip if cap applied above)

    Part A — Technical must-haves (36 pts, divided equally per skill):
      Do NOT include language proficiency as a scoreable skill.
      - Proven in a named project = 100%
      - Listed in skills/tools section only AND the skill is a tool/utility by nature
        (e.g. Git, Docker, Postman, Linux, Vite, Vercel) = 75%
      - Listed in skills section only, no project = 25%
      - Missing = 0%

    Part B — Practice must-haves (12 pts, divided equally per practice):
      Only score practices from MUST_HAVE_PRACTICES extracted in STEP 0.
      - Explicitly mentioned in a project description = 100%
      - Implied by tools used (e.g. mentions Jest/Vitest → unit testing implied) = 50%
      - Missing = 0%
      If MUST_HAVE_PRACTICES list is empty, Part B = 0 pts. Do not invent practices.

    Part C — Nice-to-haves (12 pts, divided equally per skill):
      - Mentioned anywhere in CV = 100%
      - Missing = 0%

    [S2] Experience level — 26 pts

    If JOB_LEVEL is JUNIOR:
      - Has any commercial experience = 26
      - Has internship/freelance/part-time = 20
      - No commercial exp, 3+ strong relevant projects = 16
      - No commercial exp, 1-2 projects = 8
      - No commercial exp, no relevant projects = 2

    If JOB_LEVEL is SENIOR:
      - Has required years of commercial experience = 26
      - Has commercial experience but less than required = 16
      - Has internship/freelance/part-time = 10
      - No commercial exp, 3+ projects in relevant stack = 4
      - No commercial exp, 3+ projects in DIFFERENT stack = 2
      - No commercial exp, 1-2 projects = 2
      - No experience = 0

    [S3] Project relevance — 14 pts (max 7 if cap applied in STEP 1)
      Follow these steps exactly:
      Step 1: List every named project from the CV projects section.
      Step 2: For each project, check if ANY of the PRIMARY_STACK technologies is
        explicitly named in that project's description or tech stack list.
      Step 3: Count how many projects pass Step 2. Call this N.
      Step 4: Assign points:
      - N >= 3 = 14 pts
      - N == 2 = 10 pts
      - N == 1 = 10 pts
      - N == 0 AND projects use same paradigm, different language = 7 pts
      - N == 0 AND projects partially overlap (e.g. only frontend, job needs fullstack) = 3 pts
      - N == 0 AND irrelevant projects = 0 pts

    Final score = S1 + S2 + S3. Must be integer.

    --- OUTPUT RULES ---
    - strengths: hard technical skills and engineering practices with proof present in BOTH
      CV and job posting. Exclude generic job duties and language proficiency.
    - gaps: missing technical skills and practices from MUST_HAVE_TECHS and
      MUST_HAVE_PRACTICES extracted in STEP 0 only.
      Do NOT include: language proficiency, items from responsibilities/duties section,
      soft skills, "communication", "teamwork", "time management".
      If no hard technical gaps exist, list missing NICE_TO_HAVES instead.
      Never return empty list.
    - suggestions: one suggestion per gap. Each must include: (1) exact technology or
      practice, (2) specific project from CV to modify OR a minimal concrete app idea,
      (3) what it proves to the recruiter. Max 2 sentences per suggestion.
      Never return empty list.
    - scoring_notes: one sentence max — only flag if cap was applied or an unusual
      scoring decision was made. Otherwise empty string.

    Respond ONLY with raw JSON starting with {{ and ending with }}.

    {{
      "score": <int 0-100>,
      "score_breakdown": {{
        "required_skills": <int 0-60>,
        "experience_level": <int 0-26>,
        "project_relevance": <int 0-14>
      }},
      "scoring_notes": "<one sentence or empty string>",
      "strengths": ["..."],
      "gaps": ["..."],
      "suggestions": ["..."]
    }}
    """

    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()

        raw = re.sub(r"```json|```", "", raw).strip()

        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError("Brak JSONa w odpowiedzi modelu")
        raw = raw[start:end]

        logger.debug("CLEANED RAW:\n%s", raw)

        result = json.loads(raw)

        result["score"] = int(round(result["score"]))
        for key in result.get("score_breakdown", {}):
            result["score_breakdown"][key] = int(round(result["score_breakdown"][key]))

        validated = AnalysisResult(**result)

        breakdown_sum = (
            validated.score_breakdown.required_skills +
            validated.score_breakdown.experience_level +
            validated.score_breakdown.project_relevance
        )
        if validated.score != breakdown_sum:
            logger.warning(
                "Score mismatch: score=%d, breakdown sum=%d — koryguję score",
                validated.score,
                breakdown_sum
            )
            result["score"] = breakdown_sum
            validated = AnalysisResult(**result)

        return validated.model_dump()

    except json.JSONDecodeError as e:
        logger.error("JSON PARSE ERROR: %s", e)
        raise e
    except Exception as e:
        logger.error("ERROR: %s", e)
        raise e