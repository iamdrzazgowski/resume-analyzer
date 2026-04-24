import json
import os
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_resume(resume_text: str, job_description: str):
    """Wysyła CV i ogłoszenie do Groq API i zwraca analizę."""

    prompt = f"""
    You are a senior HR recruiter with 10+ years of experience in tech recruitment. 
    You evaluate candidates objectively and critically — you do NOT inflate scores. 
    
    CANDIDATE CV:
    {resume_text}
    
    JOB POSTING:
    {job_description}
    
    SCORING INSTRUCTIONS — follow exactly:
    
    Step 1 — Required skills audit (max 60 points):
    Split the job requirements into "Must-have" (primary stack/years) and "Nice-to-have" (extra stardust).
    - MUST-HAVE (Weight: 80% of Step 1): For each core technology (e.g., Python, React):
        - Mentioned + concrete usage in named project = 100% points
        - Mentioned in Tools/Skills section ONLY (no project evidence) = 25% points (CRITICAL: Be strict here, knowing a name is not proficiency)
        - Missing = 0 points
    - NICE-TO-HAVE (Weight: 20% of Step 1):
        - Mentioned in CV = 100% points
        - Missing = 0 points
    
    CRITICAL RULE: If a "Very strong proficiency" in a specific language (e.g., Python) is required and the candidate only lists it in "Other" or has NO projects in it, the MAXIMUM total score for Step 1 is capped at 20/60.
    
    Step 2 — Seniority & Experience penalty (max 20 points):
    - Professional experience >= required years = 20
    - Professional experience < required years but > 0 = 5 points (Candidate is a Junior applying for a Mid/Senior role)
    - No professional experience (student/projects only) = 0 points
    
    Step 3 — Project & Stack Relevance (max 20 points):
    - Projects use the EXACT main stack required (e.g., Python+React) = 20
    - Projects use a similar but different stack (e.g., Node+React instead of Python+React) = 5
    - Irrelevant projects = 0
    
    Step 4 — Final score:
    Sum Step1 + Step2 + Step3. Do NOT round up. Be brutal. 
    Final score must be a whole integer.
    
    Step 5 — Identify strengths:
    List only skills present in BOTH CV (with project proof) and Job Posting.
    
    Step 6 — Identify gaps:
    List missing "Must-haves" first. If the candidate uses a different backend/frontend language than required, mark it as a CRITICAL gap.
    
    Step 7 — Suggestions:
    Focus on the stack gap. If they lack Python, suggest a specific Python-based project.
    
    Step 8 — Cover letter:
    Strictly follow the "No fluff" rule. Do not use forbidden phrases. 
    
    Respond ONLY with raw JSON. Start with {{ and end with }}.
    
    {{
      "score": <integer 0-100>,
      "score_breakdown": {{
        "required_skills": <0-60>,
        "experience_level": <0-20>,
        "project_relevance": <0-20>
      }},
      "strengths": [...],
      "gaps": [...],
      "suggestions": [...],
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