import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { analyzeResumeGemini } from '@/lib/gemini-service';

export const maxDuration = 60;
export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIN_JOB_DESCRIPTION_LENGTH = 50;

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const resumeFile = formData.get('resume_file');
    const jobDescription = formData.get('job_description');

    if (!(resumeFile instanceof File)) {
        return NextResponse.json({ detail: 'Brak pliku CV' }, { status: 400 });
    }

    if (typeof jobDescription !== 'string') {
        return NextResponse.json(
            { detail: 'Brak opisu oferty' },
            { status: 400 },
        );
    }

    if (resumeFile.type !== 'application/pdf') {
        return NextResponse.json(
            { detail: 'Plik musi być w formacie PDF' },
            { status: 400 },
        );
    }

    if (jobDescription.length < MIN_JOB_DESCRIPTION_LENGTH) {
        return NextResponse.json(
            { detail: 'Opis oferty jest za krótki' },
            { status: 400 },
        );
    }

    if (resumeFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
            { detail: 'Plik jest za duży (max 5MB)' },
            { status: 400 },
        );
    }

    const fileBytes = await resumeFile.arrayBuffer();
    const resumeText = await extractTextFromPdf(fileBytes);

    if (!resumeText) {
        return NextResponse.json(
            { detail: 'Nie można odczytać pliku PDF' },
            { status: 400 },
        );
    }

    try {
        const result = await analyzeResumeGemini(resumeText, jobDescription);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Błąd analizy:', error);
        return NextResponse.json(
            { detail: 'Błąd analizy — spróbuj ponownie' },
            { status: 500 },
        );
    }
}
