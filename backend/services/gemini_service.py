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

    --- STEP 0: EXTRACT REQUIREMENTS (do this first, before scoring) ---
    From the job posting, extract:
    - PRIMARY_STACK: the main language/framework (the one listed first or with min. years required)
    - MUST_HAVES: list of required technical skills
    - NICE_TO_HAVES: list of optional/bonus technical skills

    --- STEP 1: CRITICAL RULE CHECK ---
    If PRIMARY_STACK technology has NO named project proof in CV:
      → S1 is CAPPED at 20/60. Skip normal S1 calculation.
      → Note: "cap applied: no project proof for [technology]"

    If PRIMARY_STACK has project proof → proceed to normal S1 calculation below.

    --- SCORING (total 100 pts) ---

    [S1] Required skills — 60 pts (skip if cap applied above)
    Must-haves (48 pts, divided equally per skill):
      - Proven in a named project = 100% of skill points
      - Listed in skills section only, no project = 25% of skill points
      - Missing = 0

    Nice-to-haves (12 pts, divided equally per skill):
      - Mentioned anywhere in CV = 100% of skill points
      - Missing = 0

    Show your work:
      Must-haves found: [list]
      Nice-to-haves found: [list]
      Points per must-have skill: 48 / count = X pts
      Points per nice-to-have skill: 12 / count = X pts
      S1 total: sum

    [S2] Experience level — 20 pts
    Check if job posting specifies minimum years of commercial experience.
      - Has required years of commercial experience = 20
      - Has commercial experience but less than required = 12
      - Has internship/freelance/part-time = 8
      - No commercial exp, 3+ projects in relevant stack = 6
      - No commercial exp, 3+ projects in DIFFERENT stack = 4
      - No commercial exp, 1-2 projects = 2
      - No experience = 0

    [S3] Project relevance — 20 pts
    Compare candidate projects against PRIMARY_STACK and overall job requirements.
      - Projects use exact required stack = 20
      - Projects use same paradigm, different language (e.g. Node instead of Java) = 10
      - Projects partially overlap (e.g. only frontend, job needs fullstack) = 5
      - Irrelevant projects = 0

    Final score = S1 + S2 + S3. Must be integer.

    --- OUTPUT RULES ---
    - strengths: hard skills with project proof present in BOTH CV and job posting
    - gaps: missing technical skills only — NO soft skills, NO "communication", NO "teamwork"
    - suggestions: one specific project idea per gap (name the exact tech)
    - cover_letter: 3 sentences, first-person, no fluff, reference specific projects from CV

    Respond ONLY with raw JSON starting with {{ and ending with }}.

    {{
      "score": <int 0-100>,
      "score_breakdown": {{
        "required_skills": <int 0-60>,
        "experience_level": <int 0-20>,
        "project_relevance": <int 0-20>
      }},
      "cap_applied": <bool>,
      "cap_reason": "<string or null>",
      "scoring_notes": "<brief explanation of key decisions>",
      "strengths": ["..."],
      "gaps": ["..."],
      "suggestions": ["..."],
      "cover_letter": "..."
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