import json
import os
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_resume_groq(resume_text: str, job_description: str):
    """
    Zaawansowana analiza CV vs Job Description.
    Zoptymalizowana pod kątem rozpoznawania technologii i konkretnych porad.
    """

    prompt = f"""
    You are a Senior Technical Recruiter specializing in ATS (Applicant Tracking System) logic. Your goal is to compare a CV with a Job Description with mathematical precision.

    INPUT DATA:
    CV: {resume_text}
    JOB POSTING: {job_description}

    --- STEP 0: CONCEPT MAPPING & SYNONYMS ---
    - SQL/Databases: Include PostgreSQL, MySQL, Oracle, Prisma, MongoDB, NoSQL.
    - Git: Include GitHub, GitLab, Bitbucket, Version Control.
    - Primary Stack: If JD asks for "Java", treat any mention of "Java" (even in 'Other' skills) as a match, but distinguish between "knowledge" and "project proof".

    --- STEP 1: LOGICAL ANALYSIS (Internal Monologue) ---
    Before generating JSON, calculate:
    1. S1 (Skills - max 60): 
       - Tech Must-haves (36): List matches. If PRIMARY_STACK (main language) has no project proof, FIXED score = 20 for S1.
       - Practices (12): Code Review, Testing, CI/CD.
       - Nice-to-haves (12).
    2. S2 (Experience - max 26): 
       - If Job asks for 3+ years (Senior/Mid) and CV is Junior/No Exp: S2 = 0.
       - If Job is Junior and CV has 3+ solid projects: S2 = 26.
    3. S3 (Relevance - max 14): 
       - Count projects with Primary Stack. N>=2: 14, N=1: 10, N=0: 7 (if backend-to-backend), N=0: 0 (if irrelevant).

    --- STEP 2: CRITICAL RULES FOR OUTPUT ---
    - strengths: ONLY technologies/skills present in BOTH CV and JD. Never return an empty list; use transferable skills (REST, Git, OOP) if no direct stack match exists.
    - gaps: Technical requirements from JD missing in CV. 
    - suggestions: Generate EXACTLY 5 high-value points.
      - RULE: No generic "learn Java" advice.
      - RULE: Use "Bridge Technique": "Since you know [Known Tech], implement [Missing JD Tech] in your [Specific CV Project] to prove [Requirement]."
      - Focus on professional tools: CI/CD, Unit Testing, Cloud, or specific DB optimizations.

    --- FINAL CALCULATION ---
    Final Score = S1 + S2 + S3. (Double check: ensure the sum is mathematically correct).

    STRICT JSON ONLY. No preamble.

    {{
      "score": 0,
      "score_breakdown": {{ 
        "required_skills": 0, 
        "experience_level": 0, 
        "project_relevance": 0 
      }},
      "scoring_notes": "One sentence maximum. Mention if THE CAP penalty was applied.",
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
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system",
                 "content": "You are a precise technical analyzer. You never ignore technologies listed in the 'Projects' section of a CV. You provide 5 actionable, project-specific suggestions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,  # Zero-creativity for maximum factual accuracy
            max_tokens=2000,
            response_format={"type": "json_object"}
        )

        # Bezpośrednie parsowanie JSON bez re.sub, dzięki response_format
        result = json.loads(response.choices[0].message.content)

        # Opcjonalna korekta typów
        result["score"] = int(result.get("score", 0))
        return result

    except Exception as e:
        print(f"Błąd podczas analizy: {e}")
        return {
            "score": 0,
            "error": str(e),
            "strengths": [],
            "gaps": [],
            "suggestions": ["Nie udało się przeanalizować dokumentu."]
        }