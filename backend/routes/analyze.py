import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import AnalysisResult
from services.gemini_service import analyze_resume_gemini
from services.groq_service import analyze_resume_groq
from services.pdf_parser import extract_text_from_pdf

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post('/analyze', response_model=AnalysisResult)
async def analyze(resume_file: UploadFile = File(...), job_description: str = Form(...)):

    if resume_file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Plik musi być w formacie PDF")

    if len(job_description) < 50:
        raise HTTPException(status_code=400, detail="Opis oferty jest za krótki")

    file_bytes = await resume_file.read()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Plik jest za duży (max 5MB)")

    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(status_code=400, detail="Nie można odczytać pliku PDF")

    try:
        result = analyze_resume_groq(resume_text, job_description)
        result["score"] = int(round(result["score"]))
        return result
    except Exception as e:
        logger.error(f"Błąd analizy: {e}")
        raise HTTPException(status_code=500, detail="Błąd analizy — spróbuj ponownie")