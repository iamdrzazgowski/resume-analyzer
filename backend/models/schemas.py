from pydantic import BaseModel, Field
from typing import List


class ScoreBreakdown(BaseModel):
    required_skills: int
    experience_level: int
    project_relevance: int


class AnalysisResult(BaseModel):
    score: int
    score_breakdown: ScoreBreakdown
    strengths: List[str]
    gaps: List[str]
    suggestions: List[str]
    cover_letter: str