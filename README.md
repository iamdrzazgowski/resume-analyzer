### resume-analyzer

AI-powered Resume Analyzer

Analyze resumes against job descriptions, calculate compatibility scores, identify missing skills, and receive actionable feedback to improve hiring outcomes.

---

### Features

* Resume Parsing — Extracts text and relevant information from uploaded resumes (PDF).

* Fit Score — Calculates compatibility score.

* Job Description Matching — Compares resume content against a target job description.

* Skill Gap Detection — Highlights missing or weak skills required for the role.

* AI Feedback — Generates recommendations to improve resume quality.

---
 
## Tech Stack
 
### Frontend
 
| Category | Technology |
|---|---|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript / JavaScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Forms | React Hook Form |
| Server State | TanStack React Query v5 |
| Client State | Zustand |
| HTTP Client | Axios |
 
### Backend
 
| Category | Technology |
|---|---|
| Framework | FastAPI |
| Language | Python |
| API Style | REST |
| Server | Uvicorn |
| File Processing | PDF parsing libraries |
 
### AI Integration
 
> **Google Gemini API** — used for resume analysis, scoring, and feedback generation
 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js 18+
- Python 3.10+
- npm
- Git
---
 
### Installation
 
#### 1. Clone repository
 
```bash
git clone https://github.com/iamdrzazgowski/resume-analyzer.git
cd resume-analyzer
```
 
#### 2. Frontend setup
 
```bash
npm install
npm run dev
```
 
> Frontend runs on: **http://localhost:5173**
 
#### 3. Backend setup (FastAPI)
 
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
 
> Backend runs on: **http://localhost:8000**
 
---
 
## Example Workflow
 
1. Upload a resume (PDF)
2. Paste a job description
3. Send data to backend API
4. Gemini API analyzes CV content
5. System calculates fit score
6. App returns:
   - match score
   - missing skills
   - AI-generated recommendations
---
 
## Project Structure
 
```
resume-analyzer/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── store/
│
├── backend/
│   ├── main.py
│   ├── routers/
│   ├── services/
│   └── utils/
│
├── package.json
└── README.md
```
 
---
 
## AI Usage
 
This project uses **Google Gemini API** to:
 
- analyze resume content
- extract skills and experience
- compare against job descriptions
- generate improvement suggestions
- compute compatibility scoring logic
---
 
## Disclaimer
 
This project is intended for **educational and demonstration purposes only**.  
AI-generated scores and recommendations are not professional hiring advice and should be treated as guidance rather than a definitive evaluation.
