# Verdict — AI Résumé Analyzer

Know the verdict before the recruiter does. Paste a job description, upload a résumé, and get a precise, evidence-based match score instead of vague advice.

![Verdict — hero](https://github.com/user-attachments/assets/975757c9-1a2d-44a9-87ad-f060bbde3c69)

## What it does

Verdict analyzes a résumé against a specific job description and returns:

- **A match score out of 100**, broken down into required skills, experience level and project relevance — not a black-box number.
- **Strengths and gaps**, pulled directly from the résumé against the posting.
- **Ordered, concrete suggestions** for closing the gaps before resubmitting.

Nothing is stored beyond the session — no signup required.

## Screenshots

**Analyze**

![Upload form](https://github.com/user-attachments/assets/86da22a3-fca9-4a26-b0f3-9c4d954b3679)

**Verdict**

![Results page](https://github.com/user-attachments/assets/6b830959-8812-443c-8e6f-17a787dfbbf4)

## Tech stack

### Frontend

- [Next.js 16](https://nextjs.org) (App Router, React 19, Turbopack)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) with a custom dark, single-theme design system
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) primitives
- [TanStack Query](https://tanstack.com/query) for the analysis request lifecycle
- [React Hook Form](https://react-hook-form.com/) for the upload form
- [Zustand](https://zustand-demo.pmnd.rs/) (with persistence) for the analysis result store

### Backend

- [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/)
- [Google Gemini](https://ai.google.dev/) (`gemini-2.5-flash`) for the résumé/job-description scoring
- [PyMuPDF](https://pymupdf.readthedocs.io/) for PDF text extraction
- [Pydantic](https://docs.pydantic.dev/) response models

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) for the frontend (`bun.lock` is committed; npm/yarn/pnpm also work)
- Python 3.11+ for the backend
- A Google Gemini API key

### Frontend

```bash
cd frontend
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

Create a `.env` file in `frontend/`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Create a `.env` file in `backend/`:

```bash
GEMINI_API_KEY=your-gemini-api-key
```

The API exposes `POST /api/v1/analyze`, accepting `multipart/form-data` with a `resume_file` (PDF, max 5MB) and `job_description` (min. 50 characters), and returns the score breakdown, strengths, gaps and suggestions consumed by the results page.

## Project structure

### `frontend/`

```
frontend/
└─ src/
   ├─ app/
   │  ├─ page.tsx              # Landing page (hero, method, features, analyze form)
   │  ├─ results/[id]/page.tsx # Analysis results page
   │  └─ globals.css           # Design tokens, fonts, keyframes
   ├─ components/
   │  ├─ hero-section.tsx, method-section.tsx, features-section.tsx, ...
   │  ├─ scan-visual.tsx       # Animated "résumé scan" signature element
   │  ├─ file-upload-form.tsx  # Résumé upload + job description form
   │  └─ ui/                   # shadcn/Radix-based primitives
   ├─ hooks/useAnalyzeMutation.ts
   ├─ store/analysisStore.ts   # Persisted analysis result state
   └─ lib/                     # Types, validators, query client
```

### `backend/`

```
backend/
├─ main.py                  # FastAPI app, CORS, router registration
├─ requirements.txt
├─ routes/
│  └─ analyze.py            # POST /api/v1/analyze — validates upload, runs the analysis
├─ services/
│  └─ gemini_service.py     # Gemini prompt + scoring logic
├─ utils/
│  └─ pdf_parser.py         # PDF → text extraction (PyMuPDF)
└─ models/
   └─ schemas.py            # Pydantic models: AnalysisResult, ScoreBreakdown
```

## Design system

Verdict uses a fixed dark-luxury theme rather than a light/dark toggle: a matte black background, restrained typography (a serif display face paired with mono labels for data/eyebrows), hairline borders, and a single brass accent reserved for signature moments like the score and the scan animation.
