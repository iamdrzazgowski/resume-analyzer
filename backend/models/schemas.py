# models/schemas.py
from uuid import uuid4, UUID

from pydantic import BaseModel, Field
from typing import List, Optional

from pydantic.v1 import UUID4


class ScoreBreakdown(BaseModel):
    required_skills: int = Field(ge=0, le=60)
    experience_level: int = Field(ge=0, le=26)
    project_relevance: int = Field(ge=0, le=14)


class AnalysisResult(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    score: int = Field(ge=0, le=100)
    score_breakdown: ScoreBreakdown
    scoring_notes: Optional[str] = None
    strengths: List[str] = []
    gaps: List[str] = []
    suggestions: List[str] = []