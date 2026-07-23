# Verdict — AI Résumé Analyzer

Know the verdict before the recruiter does. Paste a job description, upload a
résumé, and get a precise, evidence-based match score instead of vague advice.

![Verdict — hero](https://github.com/user-attachments/assets/c0835160-4631-46f9-9b7c-3f6e33d7a7b4)

## What it does

Verdict analyzes a résumé against a specific job description and returns:

- **A match score out of 100**, broken down into required skills, experience
  level and project relevance — not a black-box number.
- **Strengths and gaps**, pulled directly from the résumé against the posting.
- **Ordered, concrete suggestions** for closing the gaps before resubmitting.

Nothing is stored beyond the session — no signup required.

## Screenshots

**Analyze**

![Upload form](https://github.com/user-attachments/assets/86da22a3-fca9-4a26-b0f3-9c4d954b3679)

**Verdict**

![Results page](https://github.com/user-attachments/assets/6b830959-8812-443c-8e6f-17a787dfbbf4)

## Tech stack

A single full-stack Next.js app — no separate backend service.

- [Next.js 16](https://nextjs.org) (App Router, React 19, Turbopack)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) with a custom dark, single-theme
  design system
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
  primitives
- [TanStack Query](https://tanstack.com/query) for the analysis request
  lifecycle
- [React Hook Form](https://react-hook-form.com/) for the upload form
- [Zustand](https://zustand-demo.pmnd.rs/) (with persistence) for the analysis
  result store
- **Route Handlers** (`app/api/analyze/route.ts`) for the analysis endpoint —
  replaces the former FastAPI service
- [Google Gemini](https://ai.google.dev/) (`gemini-2.5-flash`) via
  `@google/genai` for the résumé/job-description scoring
- [unpdf](https://github.com/unjs/unpdf) for PDF text extraction
- [Zod](https://zod.dev/) response/request schemas

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) (`bun.lock` is committed; npm/yarn/pnpm also work)
- A Google Gemini API key

### Install & run

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your-gemini-api-key
```

The app exposes `POST /api/analyze`, accepting `multipart/form-data` with a
`resume_file` (PDF, max 5MB) and `job_description` (min. 50 characters), and
returns the score breakdown, strengths, gaps and suggestions consumed by the
results page.

> **Note:** on Vercel, this route sets `maxDuration = 60` to accommodate the
> Gemini call — a Pro plan (or equivalent) is required for durations beyond the
> Hobby tier's default limit.

## Project structure

```
verdict/
├─ app/
│  ├─ api/
│  │  └─ analyze/
│  │     └─ route.ts         # POST /api/analyze — validates upload, runs the analysis
│  ├─ page.tsx                # Landing page (hero, method, features, analyze form)
│  ├─ results/[id]/page.tsx   # Analysis results page
│  └─ globals.css             # Design tokens, fonts, keyframes
├─ components/
│  ├─ hero-section.tsx, method-section.tsx, features-section.tsx, ...
│  ├─ scan-visual.tsx         # Animated "résumé scan" signature element
│  ├─ file-upload-form.tsx    # Résumé upload + job description form
│  └─ ui/                     # shadcn/Radix-based primitives
├─ hooks/
│  └─ useAnalyzeMutation.ts
├─ store/
│  └─ analysisStore.ts        # Persisted analysis result state
└─ lib/
   ├─ gemini-service.ts       # Gemini prompt + scoring logic
   ├─ pdf-parser.ts           # PDF → text extraction (unpdf)
   ├─ schemas.ts              # Zod models: AnalysisResult, ScoreBreakdown
   └─ query-client.ts         # TanStack Query configuration
```

## Design system

Verdict uses a fixed dark-luxury theme rather than a light/dark toggle: a matte
black background, restrained typography (a serif display face paired with mono
labels for data/eyebrows), hairline borders, and a single brass accent reserved
for signature moments like the score and the scan animation.
