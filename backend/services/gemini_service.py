import json
import os
import logging
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_resume_gemini(resume_text: str, job_description: str):
    """
    Zaawansowana analiza CV vs Job Description.
    Zoptymalizowana pod kątem rozpoznawania technologii i konkretnych porad.
    """

    prompt = f"""
    You are a Senior Technical Recruiter specializing in ATS logic.
    Your goal is to compare a CV with a Job Description with mathematical precision.

    INPUT DATA:
    CV: {resume_text}
    JOB POSTING: {job_description}

    --- STEP 0: EXTRACT REQUIREMENTS ---
    From the job posting, extract:
    - JOB_LEVEL: entry-level/junior? (look for "junior", "pierwsza praca",
      "bez doświadczenia", no minimum years → JUNIOR, otherwise SENIOR)
    - PRIMARY_STACK: main language/framework (listed first or with min. years).
      If multiple core techs are required together (e.g. React + Node.js),
      treat them as ONE combined stack.
    - MUST_HAVE_TECHS: required technical skills from the REQUIREMENTS section only.
      Do NOT include language proficiency (e.g. "język angielski", "English").
    - MUST_HAVE_PRACTICES: engineering practices from the section explicitly labeled
      as requirements (e.g. "Nasze wymagania", "Requirements", "We require") ONLY.
      NEGATIVE EXAMPLE: if "code review" appears ONLY under duties/responsibilities
      ("Obowiązki", "You will"), do NOT include it here. Same for "unit testing",
      "agile", etc. that appear only in the duties section.
    - NICE_TO_HAVES: optional/bonus technical skills
    - PART_B_WEIGHT: if MUST_HAVE_PRACTICES list is empty, set PART_B_WEIGHT = 0
      and add 12 to Part A total weight (Part A becomes 48 pts). Otherwise
      PART_B_WEIGHT = 12 and Part A = 36 pts.

    --- STEP 1: CRITICAL RULE CHECK ---
    If PRIMARY_STACK technology has NO named project proof in CV:
      → S1 is CAPPED at 20/60. Skip normal S1 calculation.
      → S3 is CAPPED at 7/14.
      → Note cap reason internally.
    If PRIMARY_STACK has project proof → proceed to normal S1 and S3 below.

    DEFINITION — "named project":
      - A project with an explicit name (e.g. "TaskFlow app", "E-commerce platform")
      - OR work experience at a named employer (e.g. "at Acme Corp, built X")
      - Freelance work WITHOUT a project name does NOT count as named project.
      - Student/university/personal GitHub projects count as named projects for
        S1/S3 purposes but NOT as commercial experience for S2.

    --- SCORING (total 100 pts) ---

    [S1] Required skills — 60 pts (skip if cap applied above)

    Part A — Technical must-haves (36 pts base, or 48 pts if PART_B_WEIGHT = 0):
      Points divided equally per skill. Do NOT include language proficiency.
      - Proven in a named project = 100%
      - Listed in skills/tools section only AND the skill is a tool/utility
        by nature (e.g. Git, Docker, Postman, Linux, Vite, Vercel) = 75%
      - Listed in skills section only, no project proof = 25%
      - Missing = 0%
      TIE-BREAKER: when unsure if a skill is "tool/utility by nature",
      treat it as NON-tool (25% score, not 75%).

    Part B — Practice must-haves (PART_B_WEIGHT pts, equally divided):
      Only score practices from MUST_HAVE_PRACTICES (extracted in STEP 0).
      - Explicitly mentioned in a project description = 100%
      - Implied by tools used (e.g. mentions Jest/Vitest → unit testing implied) = 50%
      - Missing = 0%
      If MUST_HAVE_PRACTICES is empty → Part B = 0. Do not invent practices.

    Part C — Nice-to-haves (12 pts, equally divided per skill):
      - Mentioned anywhere in CV = 100%
      - Missing = 0%

    [S2] Experience level — 26 pts

    FIRST: determine JOB_LEVEL from STEP 0.
    IMPORTANT: "Poszukuję pierwszej pracy" or "pierwsza praca" in CV = NO commercial
    experience. Student, university, and personal GitHub projects are NOT commercial.

    If JOB_LEVEL is JUNIOR:
      - Has any commercial/full-time experience = 26
      - Has internship/freelance/part-time = 20
      - No commercial exp, 3+ strong relevant projects = 16
      - No commercial exp, 1–2 projects = 8
      - No commercial exp, no relevant projects = 2

    If JOB_LEVEL is SENIOR:
      - Has required years of commercial experience = 26
      - Has commercial experience but less than required = 16
      - Has internship/freelance/part-time = 10
      - No commercial exp, 3+ projects in relevant stack = 4
      - No commercial exp, 1–2 projects = 2
      - No experience = 0

    [S3] Project relevance — 14 pts (max 7 if cap applied in STEP 1)
      Step 1: List every named project from the CV (use DEFINITION above).
      Step 2: For each project, check if ANY PRIMARY_STACK tech is explicitly named.
      Step 3: Count matching projects = N.
      - N >= 3 = 14 pts
      - N == 2 = 10 pts
      - N == 1 = 7 pts   ← changed from original (was 10)
      - N == 0, same paradigm different language = 7 pts
      - N == 0, partial overlap = 3 pts
      - N == 0, irrelevant = 0 pts

    --- FINAL CALCULATION ---
    Step 1: Write out S1 = X, S2 = Y, S3 = Z explicitly.
    Step 2: Verify: X + Y + Z = Final Score.
    Step 3: Check each value is within allowed range (S1: 0–60, S2: 0–26, S3: 0–14).
    Final Score = S1 + S2 + S3. Must be integer. No rounding up.

    --- OUTPUT RULES ---
    - strengths: hard technical skills present in BOTH CV and JD with proof.
      Exclude language proficiency and soft skills.
    - gaps: missing skills from MUST_HAVE_TECHS and MUST_HAVE_PRACTICES only.
      Do NOT include language proficiency, soft skills, or items from duties section.
      If no hard gaps exist, list missing NICE_TO_HAVES.
    - suggestions: EXACTLY 5. Each must reference (1) specific technology,
      (2) specific CV project, (3) what it proves.
      Bridge Technique: "Since you know X, add Y to [Project] to prove Z."
      Max 2 sentences each.
    - scoring_notes: one sentence — flag cap, PART_B_WEIGHT redistribution,
      or any unusual decision. Otherwise empty string.
    - language: detect language of the JOB POSTING and respond in that language.

    --- CHAIN OF THOUGHT ---
    First, write your full reasoning inside <reasoning>...</reasoning> tags.
    Include: extracted fields from STEP 0, cap decision from STEP 1,
    per-skill scoring for S1, S2 tier selection, project list and matching for S3,
    and the final arithmetic check.

    After </reasoning>, output ONLY the JSON below — no other text.

    {{
      "score": 0,
      "score_breakdown": {{
        "required_skills": 0,
        "experience_level": 0,
        "project_relevance": 0
      }},
      "scoring_notes": "",
      "strengths": ["Tech1", "Tech2"],
      "gaps": ["Gap1", "Gap2"],
      "suggestions": [
        "1. ...",
        "2. ...",
        "3. ...",
        "4. ...",
        "5. ..."
      ]
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are a precise technical analyzer. You never ignore technologies "
                    "listed in the 'Projects' section of a CV. "
                    "You provide 5 actionable, project-specific suggestions."
                ),
                temperature=0.0,
                max_output_tokens=8000,
                response_mime_type="application/json",
            ),
        )

        result = json.loads(response.text)

        result["score"] = int(result.get("score", 0))
        return result

    except Exception as e:
        logger.error("Błąd podczas analizy: %s", e)
        return {
            "score": 0,
            "error": str(e),
            "score_breakdown": {
                "required_skills": 0,
                "experience_level": 0,
                "project_relevance": 0
            },
            "scoring_notes": "",
            "strengths": [],
            "gaps": [],
            "suggestions": ["Nie udało się przeanalizować dokumentu."]
        }