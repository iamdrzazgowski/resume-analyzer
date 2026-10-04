'use client';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
    type AnalysisHistoryItem,
    useAnalysisStore,
} from '@/store/analysisStore';
import { Archive, ArrowLeft, Clock3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

function scoreClass(pct: number) {
    if (pct >= 75) return 'text-(--success-foreground)';
    if (pct >= 50) return 'text-(--warning-foreground)';
    return 'text-destructive';
}

// js-cache-function-results: one formatter for all rows, not one per row.
const analyzedAtFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function formatAnalyzedAt(iso: string) {
    return analyzedAtFormatter.format(new Date(iso));
}

function HistoryLoading() {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-3 bg-muted/30 px-6'>
            <div className='h-1 w-40 overflow-hidden rounded-full bg-muted'>
                <div className='h-full w-1/3 animate-loading-sweep rounded-full bg-(--brand)' />
            </div>
            <p className='text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                Loading history
            </p>
        </div>
    );
}

export default function HistoryPage() {
    const router = useRouter();
    const hasHydrated = useAnalysisStore((s) => s.hasHydrated);
    const history = useAnalysisStore((s) => s.history);
    const setResult = useAnalysisStore((s) => s.setResult);
    const removeFromHistory = useAnalysisStore((s) => s.removeFromHistory);
    const clearHistory = useAnalysisStore((s) => s.clearHistory);

    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [clearOpen, setClearOpen] = useState(false);

    // Store keeps history sorted on insert; no re-sort per render.
    const items = history;

    const pendingItem = useMemo(
        () => items.find((item) => item.id === pendingDeleteId),
        [items, pendingDeleteId],
    );

    function openAnalysis(item: AnalysisHistoryItem) {
        setResult(item.result);
        router.push(`/results/${item.id}`);
    }

    if (!hasHydrated) {
        return <HistoryLoading />;
    }

    return (
        <div className='min-h-screen bg-muted/30'>
            <div className='sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md'>
                <div className='mx-auto flex max-w-3xl items-center justify-between px-6 py-4'>
                    <Link href='/' aria-label='Verdict home'>
                        <Logo />
                    </Link>
                    <button
                        type='button'
                        onClick={() => router.push('/')}
                        className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'>
                        <ArrowLeft className='h-3.5 w-3.5' />
                        New analysis
                    </button>
                </div>
            </div>

            <div className='mx-auto max-w-3xl space-y-8 px-6 py-12'>
                <div className='flex flex-wrap items-end justify-between gap-4'>
                    <div>
                        <p className='mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                            <span
                                aria-hidden
                                className='h-1.5 w-1.5 rounded-full bg-(--brand)'
                            />
                            Local history
                        </p>
                        <h1 className='text-3xl font-semibold tracking-tight text-foreground'>
                            Previous verdicts
                        </h1>
                        <p className='mt-2 max-w-md text-sm leading-relaxed text-muted-foreground'>
                            Analyses stay in this browser only. Opening one
                            shows the original result — nothing is re-analyzed.
                        </p>
                    </div>
                    {items.length > 0 && (
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => setClearOpen(true)}>
                            Clear history
                        </Button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className='rounded-2xl border border-border bg-card px-8 py-16 text-center shadow-sm'>
                        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--brand-soft)'>
                            <Archive className='h-6 w-6 text-(--brand-foreground)' />
                        </div>
                        <h2 className='text-xl font-semibold tracking-tight text-foreground'>
                            No analyses yet
                        </h2>
                        <p className='mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground'>
                            Run an analysis to keep a local record of scores and
                            recommendations on this device.
                        </p>
                        <Button
                            className='mt-6'
                            onClick={() => router.push('/#analyze')}>
                            Get your verdict
                        </Button>
                    </div>
                ) : (
                    <ul className='space-y-3'>
                        {items.map((item) => {
                            const score = item.result.overall_score.percentage;
                            const title =
                                item.jobTitle ||
                                item.result.job_analysis.job_title ||
                                'Untitled role';

                            return (
                                <li key={item.id}>
                                    <div className='group flex items-stretch gap-2 rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-(--brand-soft-border) hover:bg-(--brand-soft)/40'>
                                        <button
                                            type='button'
                                            onClick={() => openAnalysis(item)}
                                            className='min-w-0 flex-1 px-5 py-4 text-left'>
                                            <div className='flex items-start justify-between gap-4'>
                                                <div className='min-w-0'>
                                                    <p className='truncate text-sm font-medium text-foreground'>
                                                        {item.fileName ||
                                                            'Untitled résumé'}
                                                    </p>
                                                    <p className='mt-1 truncate text-sm text-muted-foreground'>
                                                        {title}
                                                    </p>
                                                    <p className='mt-2 flex items-center gap-1.5 text-xs text-muted-foreground'>
                                                        <Clock3 className='h-3.5 w-3.5 shrink-0' />
                                                        {formatAnalyzedAt(
                                                            item.createdAt,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className='shrink-0 text-right'>
                                                    <p
                                                        className={`text-2xl font-semibold tracking-tight ${scoreClass(score)}`}>
                                                        {score}
                                                    </p>
                                                    <p className='text-[11px] uppercase tracking-widest text-muted-foreground'>
                                                        / 100
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            type='button'
                                            aria-label={`Delete analysis for ${item.fileName || title}`}
                                            onClick={() =>
                                                setPendingDeleteId(item.id)
                                            }
                                            className='m-2 flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-lg text-muted-foreground transition-colors hover:bg-(--destructive-soft) hover:text-destructive'>
                                            <Trash2 className='h-4 w-4' />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <ConfirmDialog
                open={Boolean(pendingDeleteId)}
                title='Delete this analysis?'
                description={
                    pendingItem
                        ? `This will remove the saved verdict for ${pendingItem.fileName || pendingItem.jobTitle || 'this résumé'} from this browser.`
                        : 'This will remove the saved verdict from this browser.'
                }
                confirmLabel='Delete'
                onConfirm={() => {
                    if (pendingDeleteId) removeFromHistory(pendingDeleteId);
                }}
                onClose={() => setPendingDeleteId(null)}
            />

            <ConfirmDialog
                open={clearOpen}
                title='Clear all history?'
                description='Every locally saved analysis on this device will be removed. This cannot be undone.'
                confirmLabel='Clear history'
                onConfirm={clearHistory}
                onClose={() => setClearOpen(false)}
            />
        </div>
    );
}
