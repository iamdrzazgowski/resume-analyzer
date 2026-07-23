'use client';

import Chip from '@/components/ui/chip';
import ScoreBar from '@/components/score-bar';
import { Button } from '@/components/ui/button';
import LoadingAnalyze from '@/components/ui/loading-analyze';
import { useAnalysisStore } from '@/store/analysisStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const BREAKDOWN = [
    { label: 'Required skills', key: 'required_skills', max: 48 },
    { label: 'Experience level', key: 'experience_level', max: 25 },
    { label: 'Project relevance', key: 'project_relevance', max: 27 },
] as const;

function tier(pct: number) {
    if (pct >= 75) {
        return { text: 'text-(--brass-soft)', bar: 'bg-(--brass)' };
    }
    if (pct >= 50) {
        return { text: 'text-foreground', bar: 'bg-muted-foreground' };
    }
    return { text: 'text-destructive', bar: 'bg-destructive' };
}

export default function ResultPage() {
    const data = useAnalysisStore((s) => s.result);
    const isLoading = useAnalysisStore((s) => s.isLoading);
    const setLoading = useAnalysisStore((s) => s.setLoading);
    const router = useRouter();

    useEffect(() => {
        setLoading(false);
    }, [setLoading]);

    if (isLoading) {
        return <LoadingAnalyze />;
    }

    if (!data) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center'>
                <p className='font-mono text-[11px] uppercase tracking-[0.16em] text-destructive'>
                    Something went wrong
                </p>
                <h1 className='font-heading text-3xl text-foreground'>
                    We couldn&apos;t find that analysis
                </h1>
                <Button onClick={() => router.push('/')}>
                    Back to form
                </Button>
            </div>
        );
    }

    const scoreTier = tier(data.score);

    return (
        <div className='min-h-screen bg-background'>
            <div className='sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md'>
                <div className='mx-auto flex max-w-2xl items-center justify-between px-6 py-4'>
                    <Link
                        href='/'
                        className='font-mono text-[13px] tracking-[0.18em] text-foreground'>
                        VERDICT
                    </Link>
                    <button
                        onClick={() => router.push('/')}
                        className='flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground'>
                        <ArrowLeft className='h-3.5 w-3.5' />
                        New analysis
                    </button>
                </div>
            </div>

            <div className='mx-auto max-w-2xl px-6 py-16'>
                <section>
                    <p className='mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                        <span
                            aria-hidden
                            className='h-1.5 w-1.5 rounded-full bg-(--brass)'
                        />
                        Analysis complete
                    </p>

                    <div className='flex flex-wrap items-end justify-between gap-6'>
                        <div>
                            <h1 className='font-heading text-3xl text-foreground md:text-4xl'>
                                Your verdict
                            </h1>
                            <p className='mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground'>
                                Based on required skills, experience level
                                and project relevance.
                            </p>
                        </div>
                        <div className='flex items-baseline gap-1.5'>
                            <span
                                className={`font-heading text-6xl md:text-7xl ${scoreTier.text}`}>
                                {data.score}
                            </span>
                            <span className='text-lg text-muted-foreground'>
                                /100
                            </span>
                        </div>
                    </div>

                    <div className='mt-10 h-px w-full bg-border' />

                    <div className='mt-10 space-y-5'>
                        {BREAKDOWN.map(({ label, key, max }) => {
                            const value = data.score_breakdown[key];
                            const tierStyle = tier(
                                Math.round((value / max) * 100),
                            );
                            return (
                                <div
                                    key={key}
                                    className='flex items-center gap-4'>
                                    <span className='w-36 shrink-0 font-mono text-[11px] uppercase tracking-widest text-muted-foreground'>
                                        {label}
                                    </span>
                                    <ScoreBar
                                        value={value}
                                        max={max}
                                        color={tierStyle.bar}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {data.scoring_notes && (
                        <p className='mt-10 border-l border-(--brass-dim) pl-5 font-heading text-xl leading-relaxed text-muted-foreground italic'>
                            &ldquo;{data.scoring_notes}&rdquo;
                        </p>
                    )}
                </section>

                <section className='mt-20'>
                    <p className='mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                        Evidence
                    </p>
                    <div className='grid gap-10 border-t border-border pt-8 sm:grid-cols-2'>
                        <div>
                            <p className='mb-3 text-sm text-foreground'>
                                Strengths{' '}
                                <span className='text-muted-foreground'>
                                    ({data.strengths.length})
                                </span>
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {data.strengths.map((s) => (
                                    <Chip
                                        key={s}
                                        label={s}
                                        variant='strength'
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className='mb-3 text-sm text-foreground'>
                                Gaps{' '}
                                <span className='text-muted-foreground'>
                                    ({data.gaps.length})
                                </span>
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {data.gaps.map((g) => (
                                    <Chip key={g} label={g} variant='gap' />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className='mt-20'>
                    <p className='mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                        Fixes
                    </p>
                    <ol className='border-t border-border'>
                        {data.suggestions.map((suggestion, i) => (
                            <li
                                key={i}
                                className='flex gap-5 border-b border-border py-6'>
                                <span className='font-mono text-sm text-(--brass-soft)'>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <p className='text-sm leading-relaxed text-muted-foreground'>
                                    {suggestion}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>

                <Button
                    className='mt-16 h-12 w-full text-[0.95rem]'
                    onClick={() => router.push('/')}>
                    Analyze another résumé
                </Button>
            </div>
        </div>
    );
}
