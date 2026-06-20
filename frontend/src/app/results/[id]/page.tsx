'use client';

import LoadingAnalyze from '@/components/ui/loading-analyze';
import { useAnalysisStore } from '@/store/analysisStore';
import { useEffect } from 'react';

export default function ResultPage() {
    const { result, isLoading, setLoading } = useAnalysisStore();
    console.log(result);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (isLoading) {
        return <LoadingAnalyze />;
    }

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
