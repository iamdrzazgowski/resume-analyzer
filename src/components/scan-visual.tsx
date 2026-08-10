'use client';

import { useEffect, useState } from 'react';
import {
    SCAN_LINE_REVEAL_BASE_MS,
    SCAN_LINE_REVEAL_STRIDE_MS,
} from '@/lib/animation';

interface ScanLine {
    text: string;
    match: boolean;
}

const LINES: ScanLine[] = [
    { text: 'Senior Product Designer · 5 yrs', match: true },
    { text: 'Led design systems across 3 platforms', match: true },
    { text: 'Figma · Framer · Design tokens', match: true },
    { text: 'Managed a team of 4 designers', match: false },
    { text: 'B.A. Visual Communication', match: true },
];

const FINAL_SCORE = 94;

function prefersReducedMotion() {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}

export function ScanVisual() {
    const [phase, setPhase] = useState<'scanning' | 'done'>(() =>
        prefersReducedMotion() ? 'done' : 'scanning',
    );
    const [score, setScore] = useState(() =>
        prefersReducedMotion() ? FINAL_SCORE : 0,
    );

    useEffect(() => {
        if (phase !== 'scanning') return;
        const timer = setTimeout(() => setPhase('done'), 2100);
        return () => clearTimeout(timer);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'done' || prefersReducedMotion()) return;

        let raf: number;
        const start = performance.now();
        const duration = 900;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setScore(Math.round(FINAL_SCORE * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [phase]);

    return (
        <div className='relative w-full max-w-110 select-none'>
            <div className='relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-slate-900/5 dark:shadow-black/30'>
                {phase === 'scanning' && (
                    <div
                        aria-hidden
                        className='absolute inset-x-0 h-16 animate-scan-sweep'
                        style={{
                            background:
                                'linear-gradient(to bottom, transparent, var(--brand-soft) 45%, var(--brand-soft) 55%, transparent)',
                            boxShadow: '0 0 24px 0 var(--brand-soft)',
                        }}
                    />
                )}

                <div className='flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5'>
                    <div className='flex items-center gap-2'>
                        <span className='font-mono text-[11px] tracking-wide text-muted-foreground'>
                            resume_alex-chen.pdf
                        </span>
                    </div>
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors duration-500 ${
                            phase === 'scanning'
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-(--success-soft) text-(--success-foreground)'
                        }`}>
                        {phase === 'scanning' ? 'analyzing' : 'matched'}
                    </span>
                </div>

                <div className='space-y-3.5 px-5 py-5'>
                    {LINES.map((line, i) => (
                        <div
                            key={line.text}
                            className='flex items-center gap-3 opacity-0 animate-reveal-up'
                            style={{
                                animationDelay: `${SCAN_LINE_REVEAL_BASE_MS + i * SCAN_LINE_REVEAL_STRIDE_MS}ms`,
                                animationFillMode: 'forwards',
                            }}>
                            <span
                                aria-hidden
                                className={`h-1.25 w-1.25 shrink-0 rounded-full ${
                                    line.match
                                        ? 'bg-(--success)'
                                        : 'bg-muted-foreground opacity-40'
                                }`}
                            />
                            <span className='truncate font-mono text-[12.5px] text-muted-foreground'>
                                {line.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div className='flex items-center justify-between border-t border-border px-5 py-4'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground'>
                            Match score
                        </span>
                        <span className='text-[11px] text-muted-foreground'>
                            vs. job description
                        </span>
                    </div>
                    <div className='flex items-baseline gap-1 font-mono tabular-nums'>
                        <span className='text-3xl font-semibold text-foreground'>
                            {score}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            /100
                        </span>
                    </div>
                </div>
            </div>

            <div
                aria-hidden
                className='absolute -inset-x-4 -bottom-4 -z-10 h-16 rounded-full opacity-50 blur-2xl'
                style={{ background: 'var(--brand-soft-border)' }}
            />
        </div>
    );
}
