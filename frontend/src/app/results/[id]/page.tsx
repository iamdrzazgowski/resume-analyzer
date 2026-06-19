'use client';

import { useAnalysisStore } from '@/store/analysisStore';

export default function ResultPage() {
    const result = useAnalysisStore((s) => s.result);

    if (!result) {
        return (
            <div className='h-screen flex items-center justify-center'>
                No data (refresh lost state)
            </div>
        );
    }

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Score: {result.score}</h1>

            <p>{result.scoring_notes}</p>

            <div>
                <h2>Strengths</h2>
                <ul>
                    {result.strengths.map((s) => (
                        <li key={s}>{s}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
