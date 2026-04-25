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
    You are a senior tech recruiter. Score the candidate objectively — no inflation, no deflation.

    CV: {resume_text}
    JOB POSTING: {job_description}

    --- SCORING (total 100 pts) ---

    [S1] Required skills — 60 pts
    Identify must-haves and nice-to-haves from the job posting.

    Must-haves (48 pts total, split equally per skill):
      - Skill proven in a named project = full points
      - Skill listed only in skills/tools section = 25% points
      - Skill missing = 0

    Nice-to-haves (12 pts total, split equally per skill):
      - Mentioned anywhere in CV = full points
      - Missing = 0

    [S2] Experience level — 20 pts
      - Commercial experience >= required = 20
      - Some commercial experience (internship/freelance/part-time) = 12
      - No commercial exp, but 3+ relevant projects = 8
      - No commercial exp, 1-2 projects = 4
      - No experience, no projects = 0

    [S3] Project relevance — 20 pts
      - Projects use exact required stack = 20
      - Projects use similar stack (e.g. Node instead of Python) = 12
      - Projects partially overlap = 6
      - Irrelevant projects = 0

    Final score = S1 + S2 + S3. Integer only.

    --- OUTPUT RULES ---
    - strengths: only hard skills proven in BOTH CV projects AND job posting
    - gaps: only missing technical skills (NO soft skills like teamwork, communication)
    - suggestions: one concrete project idea per gap (e.g. "Build a REST API in Python using FastAPI")
    - cover_letter: 3 sentences, no fluff, first-person, specific to this job

    Respond ONLY with raw JSON starting with {{ and ending with }}.

    {{
      "score": <int 0-100>,
      "score_breakdown": {{
        "required_skills": <int 0-60>,
        "experience_level": <int 0-20>,
        "project_relevance": <int 0-20>
      }},
      "strengths": ["..."],
      "gaps": ["..."],
      "suggestions": ["..."],
      "cover_letter": "..."
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