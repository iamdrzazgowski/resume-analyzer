import json
import os
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_resume_groq(resume_text: str, job_description: str):
    """Wysyła CV i ogłoszenie do Groq API i zwraca analizę."""

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
      → S1 = exactly 20 pts. Do not calculate normally.
      → S3 = exactly 7 pts. Do not calculate normally.
      → S2 = calculate normally using the rules below. Cap does NOT affect S2.
      → Skip S1 and S3 calculations below. Proceed directly to S2 calculation.
      → Note cap reason internally.

    If PRIMARY_STACK has project proof → calculate S1, S2, and S3 normally.

    --- SCORING (total 100 pts) ---

    [S1] Required skills — 60 pts (skip, set to exactly 20 if cap applied above)

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
    Always calculate S2, even if cap was applied in STEP 1.

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

    [S3] Project relevance — 14 pts (skip, set to exactly 7 if cap applied in STEP 1)
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
      - N == 0 AND projects partially overlap = 3 pts
      - N == 0 AND irrelevant projects = 0 pts

    IMPORTANT: Final score = S1 + S2 + S3.
    If cap was applied: S1 and S3 are fixed values, but S2 was still calculated normally.
    Double-check that all three components are non-zero before summing.
    Final score must be integer.

    --- OUTPUT RULES ---
    - strengths: NEVER return an empty list under any circumstances.
      Priority order:
      1. Hard technical skills proven in projects present in BOTH CV and job posting.
      2. If none: transferable skills from CV closest to job requirements,
         labeled as "X (transferable)". Example: "Backend development (Node.js/Express)",
         "REST API design", "SQL databases".
      3. If still none: candidate's top 3 strongest technical skills from CV.
      Exclude generic job duties and language proficiency.

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
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2000
        )

        raw = response.choices[0].message.content
        print("RAW RESPONSE:\n", raw)

        raw = re.sub(r"```json|```", "", raw).strip()

        result = json.loads(raw)
        result["score"] = int(round(result["score"]))

        return result

    except json.JSONDecodeError as e:
        print("JSON PARSE ERROR:", e)
        raise e
    except Exception as e:
        print("ERROR:", e)
        raise e