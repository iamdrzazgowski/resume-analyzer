# models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional


class ScoreBreakdown(BaseModel):
    required_skills: int = Field(ge=0, le=60)
    experience_level: int = Field(ge=0, le=26)
    project_relevance: int = Field(ge=0, le=14)


class AnalysisResult(BaseModel):
    score: int = Field(ge=0, le=100)
    score_breakdown: ScoreBreakdown
    scoring_notes: Optional[str] = None
    strengths: List[str] = []
    gaps: List[str] = []
    suggestions: List[str] = []