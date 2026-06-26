'use client';

import Chip from '@/components/chip';
import ScoreBar from '@/components/score-bar';
import { Button } from '@/components/ui/button';
import LoadingAnalyze from '@/components/ui/loading-analyze';
import { useAnalysisStore } from '@/store/analysisStore';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ScoreBreakdown {
    required_skills: number;
    experience_level: number;
    project_relevance: number;
}

interface AnalysisResult {
    id: string;
    score: number;
    score_breakdown: ScoreBreakdown;
    strengths: string[];
    gaps: string[];
    suggestions: string[];
    scoring_notes: string;
}

const BREAKDOWN_MAX = {
    required_skills: 48,
    experience_level: 25,
    project_relevance: 27,
} as const;

function ScoreColor(score: number) {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-400';
    return 'bg-red-400';
}

export default function ResultPage() {
    const { result: data, isLoading, setLoading } = useAnalysisStore();
    const router = useRouter();

    useEffect(() => {
        setLoading(false);
    }, []);

    if (isLoading) {
        return <LoadingAnalyze />;
    }

    if (!data) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
                <p className='text-sm text-destructive'>Something went wrong</p>
                <Button variant='outline' onClick={() => router.push('/')}>
                    Back to form
                </Button>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-background'>
            <div className='mx-auto max-w-lg px-6 py-10 space-y-5'>
                <button
                    onClick={() => router.push('/')}
                    className='flex items-center gap-1.5 text-xs text-muted-foreground
                     hover:text-foreground transition-colors'>
                    <ArrowLeft className='w-3.5 h-3.5' />
                    New analysis
                </button>

                <div className='rounded-xl border border-border bg-card p-5 space-y-4'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h1 className='text-sm font-medium text-foreground'>
                                Match score
                            </h1>
                            <p className='text-xs text-muted-foreground mt-0.5'>
                                Based on required skills, experience &amp;
                                projects
                            </p>
                        </div>
                        <div className='text-right'>
                            <span className='text-4xl font-medium tabular-nums'>
                                {data.score}
                            </span>
                            <span className='text-base text-muted-foreground'>
                                /100
                            </span>
                        </div>
                    </div>

                    <div className='h-1.5 rounded-full bg-muted overflow-hidden'>
                        <div
                            className={`h-full rounded-full ${ScoreColor(data.score)}`}
                            style={{ width: `${data.score}%` }}
                        />
                    </div>

                    <div className='space-y-2.5 pt-1'>
                        <p className='text-xs text-muted-foreground'>
                            Score breakdown
                        </p>
                        {(
                            [
                                [
                                    'Required skills',
                                    'required_skills',
                                    'bg-green-500',
                                ],
                                [
                                    'Experience level',
                                    'experience_level',
                                    'bg-amber-400',
                                ],
                                [
                                    'Project relevance',
                                    'project_relevance',
                                    'bg-amber-400',
                                ],
                            ] as const
                        ).map(([label, key, color]) => (
                            <div key={key} className='flex items-center gap-3'>
                                <span className='text-xs text-muted-foreground w-36 shrink-0'>
                                    {label}
                                </span>
                                <ScoreBar
                                    value={data.score_breakdown[key]}
                                    max={BREAKDOWN_MAX[key]}
                                    color={color}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className='rounded-xl border border-border bg-card p-5 space-y-4'>
                    <div>
                        <p className='text-xs text-muted-foreground mb-2.5'>
                            Strengths ({data.strengths.length})
                        </p>
                        <div className='flex flex-wrap gap-2'>
                            {data.strengths.map((s) => (
                                <Chip key={s} label={s} variant='strength' />
                            ))}
                        </div>
                    </div>

                    <div className='h-px bg-border' />

                    <div>
                        <p className='text-xs text-muted-foreground mb-2.5'>
                            Gaps ({data.gaps.length})
                        </p>
                        <div className='flex flex-wrap gap-2'>
                            {data.gaps.map((g) => (
                                <Chip key={g} label={g} variant='gap' />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='rounded-xl border border-border bg-card p-5'>
                    <p className='text-xs text-muted-foreground mb-4'>
                        Suggestions to improve your CV
                    </p>
                    <ol className='space-y-4'>
                        {data.suggestions.map((suggestion, i) => (
                            <li key={i}>
                                <div className='flex gap-3 items-start'>
                                    <span
                                        className='w-5 h-5 rounded-full bg-muted flex items-center justify-center
                               text-[10px] text-muted-foreground shrink-0 mt-0.5'>
                                        {i + 1}
                                    </span>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        {suggestion}
                                    </p>
                                </div>
                                {i < data.suggestions.length - 1 && (
                                    <div className='h-px bg-border mt-4' />
                                )}
                            </li>
                        ))}
                    </ol>
                </div>

                <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => router.push('/')}>
                    Analyse another CV
                </Button>
            </div>
        </div>
    );
}
