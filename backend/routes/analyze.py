from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from models.schemas import AnalysisResult
from services.groq_service import analyze_resume
from services.pdf_parser import extract_text_from_pdf

router = APIRouter()

@router.post('/analyze', response_model=AnalysisResult)
async def analyze(resume_file: UploadFile = File(...), job_description: str = Form(...)):

    if resume_file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="File type must be pdf"
        )

    if len(job_description) < 50:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short"
        )

    file_bytes = await resume_file.read()
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Cannot read resume file"
        )

    try:
        result = analyze_resume(resume_text, job_description)
        result["score"] = int(round(result["score"]))
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="AI analyze failed"
        )