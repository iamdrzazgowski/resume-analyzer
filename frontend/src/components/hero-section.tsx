import { ArrowRight } from 'lucide-react';
import { ScanVisual } from './scan-visual';

export function HeroSection() {
    return (
        <section className='relative overflow-hidden'>
            <div
                aria-hidden
                className='pointer-events-none absolute inset-0 grain-vignette'
            />

            <div className='relative mx-auto grid max-w-6xl gap-16 px-6 pt-24 pb-28 md:px-10 md:pt-32 md:pb-36 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
                <div>
                    <p
                        className='mb-7 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground opacity-0 animate-reveal-up'
                        style={{ animationDelay: '80ms' }}>
                        <span
                            aria-hidden
                            className='h-1.5 w-1.5 rounded-full bg-(--brass)'
                        />
                        AI resume analysis
                    </p>

                    <h1
                        className='max-w-xl text-balance font-heading text-[2.75rem] leading-[1.08] text-foreground opacity-0 animate-reveal-up sm:text-[3.4rem] md:text-[3.75rem]'
                        style={{ animationDelay: '180ms' }}>
                        Know the{' '}
                        <em className='not-italic text-(--brass-soft)'>
                            verdict
                        </em>{' '}
                        before the recruiter does.
                    </h1>

                    <p
                        className='mt-7 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground opacity-0 animate-reveal-up'
                        style={{ animationDelay: '300ms' }}>
                        Paste the job description. Upload your résumé. Get a
                        precise, evidence-based match score, the exact gaps
                        holding you back, and what to fix, in under a minute.
                    </p>

                    <div
                        className='mt-10 flex flex-wrap items-center gap-6 opacity-0 animate-reveal-up'
                        style={{ animationDelay: '420ms' }}>
                        <a
                            href='#analyze'
                            className='group inline-flex h-12 items-center gap-2 rounded-[calc(var(--radius)*0.9)] bg-primary px-6 text-[0.95rem] font-medium text-primary-foreground transition-transform active:translate-y-px'>
                            Get your verdict
                            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                        </a>
                        <a
                            href='#method'
                            className='text-[0.95rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'>
                            See how it works
                        </a>
                    </div>

                    <p
                        className='mt-8 font-mono text-[11px] tracking-wide text-muted-foreground/70 opacity-0 animate-reveal-up'
                        style={{ animationDelay: '520ms' }}>
                        No signup · Nothing stored beyond your session
                    </p>
                </div>

                <div
                    className='opacity-0 animate-reveal-up lg:justify-self-end'
                    style={{ animationDelay: '360ms' }}>
                    <ScanVisual />
                </div>
            </div>
        </section>
    );
}
