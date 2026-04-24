from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyze import router

app = FastAPI(
    title="CV Analyzer API",
    description="Analizuje dopasowanie CV do oferty pracy przy użyciu AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")
@app.get('/')
def root():
    return {"status": "ok", "message": "CV Analyzer API działa!"}
