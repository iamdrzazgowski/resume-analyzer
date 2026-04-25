# from pydantic import BaseModel, Field
# from typing import List
#
#
# class ScoreBreakdown(BaseModel):
#     required_skills: int
#     experience_level: int
#     project_relevance: int
#
#
# class AnalysisResult(BaseModel):
#     score: int
#     score_breakdown: ScoreBreakdown
#     strengths: List[str]
#     gaps: List[str]
#     suggestions: List[str]
#     cover_letter: str

# models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional


class ScoreBreakdown(BaseModel):
    required_skills: int = Field(ge=0, le=60)
    experience_level: int = Field(ge=0, le=20)
    project_relevance: int = Field(ge=0, le=20)


class AnalysisResult(BaseModel):
    score: int = Field(ge=0, le=100)
    score_breakdown: ScoreBreakdown
    cap_applied: bool
    cap_reason: Optional[str] = None
    scoring_notes: str
    strengths: List[str] = Field(min_length=1)
    gaps: List[str] = Field(min_length=1)
    suggestions: List[str] = Field(min_length=1)
    cover_letter: str = Field(min_length=50, max_length=600)