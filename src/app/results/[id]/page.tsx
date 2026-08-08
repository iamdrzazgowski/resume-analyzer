'use client';

import Chip from '@/components/ui/chip';
import ScoreBar from '@/components/score-bar';
import { Button } from '@/components/ui/button';
import LoadingAnalyze from '@/components/ui/loading-analyze';
import { Logo } from '@/components/logo';
import { OverallScore } from '@/lib/schemas';
import { useAnalysisStore } from '@/store/analysisStore';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function tier(pct: number) {
    if (pct >= 75) {
        return {
            text: 'text-(--success-foreground)',
            bar: 'bg-(--success)',
        };
    }
    if (pct >= 50) {
        return {
            text: 'text-(--warning-foreground)',
            bar: 'bg-(--warning)',
        };
    }
    return { text: 'text-destructive', bar: 'bg-destructive' };
}

function ratingClass(rating: OverallScore['rating']) {
    switch (rating) {
        case 'Excellent':
            return 'border-(--success-soft-border) bg-(--success-soft) text-(--success-foreground)';
        case 'Good':
            return 'border-(--brand-soft-border) bg-(--brand-soft) text-(--brand-foreground)';
        case 'Average':
            return 'border-(--warning-soft-border) bg-(--warning-soft) text-(--warning-foreground)';
        case 'Poor':
            return 'border-(--destructive-soft-border) bg-(--destructive-soft) text-destructive';
    }
}

function Tag({ label }: { label: string }) {
    return (
        <span className='inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground'>
            {label}
        </span>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className='mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
            <span
                aria-hidden
                className='h-1.5 w-1.5 rounded-full bg-(--brand)'
            />
            {children}
        </p>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return (
        <section className='rounded-2xl border border-border bg-card p-8 shadow-sm'>
            {children}
        </section>
    );
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
                <p className='text-[11px] font-medium uppercase tracking-[0.14em] text-destructive'>
                    Something went wrong
                </p>
                <h1 className='text-3xl font-semibold tracking-tight text-foreground'>
                    We couldn&apos;t find that analysis
                </h1>
                <Button onClick={() => router.push('/')}>Back to form</Button>
            </div>
        );
    }

    const {
        overall_score,
        candidate_profile,
        job_analysis,
        skills_analysis,
        experience_analysis,
        project_analysis,
        ats_analysis,
        strengths,
        weaknesses,
        cv_improvement_suggestions,
        final_recommendation,
    } = data;

    const scoreTier = tier(overall_score.percentage);

    const totalSkills =
        skills_analysis.matched_skills.length +
        skills_analysis.missing_skills.length;
    const skillsMatchPct =
        totalSkills > 0
            ? Math.round(
                  (skills_analysis.matched_skills.length / totalSkills) * 100,
              )
            : 0;

    const BREAKDOWN = [
        { label: 'Skills match', value: skillsMatchPct },
        { label: 'Experience match', value: experience_analysis.match_percentage },
        { label: 'ATS keywords', value: ats_analysis.keyword_match_score },
        { label: 'CV structure', value: ats_analysis.cv_structure_score },
    ];

    return (
        <div className='min-h-screen bg-muted/30'>
            <div className='sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md'>
                <div className='mx-auto flex max-w-3xl items-center justify-between px-6 py-4'>
                    <Link href='/' aria-label='Verdict home'>
                        <Logo />
                    </Link>
                    <button
                        onClick={() => router.push('/')}
                        className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'>
                        <ArrowLeft className='h-3.5 w-3.5' />
                        New analysis
                    </button>
                </div>
            </div>

            <div className='mx-auto max-w-3xl space-y-6 px-6 py-12'>
                <Card>
                    <p className='mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                        <span
                            aria-hidden
                            className='h-1.5 w-1.5 rounded-full bg-(--success)'
                        />
                        Analysis complete
                    </p>

                    <div className='flex flex-wrap items-end justify-between gap-6'>
                        <div>
                            <h1 className='text-3xl font-semibold tracking-tight text-foreground md:text-4xl'>
                                Your verdict
                            </h1>
                            <p className='mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground'>
                                Based on skills, experience, project relevance
                                and ATS compatibility.
                            </p>
                            <span
                                className={`mt-4 inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest ${ratingClass(overall_score.rating)}`}>
                                {overall_score.rating}
                            </span>
                        </div>
                        <div className='flex items-baseline gap-1.5'>
                            <span
                                className={`text-6xl font-semibold tracking-tight md:text-7xl ${scoreTier.text}`}>
                                {overall_score.percentage}
                            </span>
                            <span className='text-lg text-muted-foreground'>
                                /100
                            </span>
                        </div>
                    </div>

                    <div className='mt-10 h-px w-full bg-border' />

                    <div className='mt-10 space-y-5'>
                        {BREAKDOWN.map(({ label, value }) => {
                            const tierStyle = tier(value);
                            return (
                                <div
                                    key={label}
                                    className='flex items-center gap-4'>
                                    <span className='w-36 shrink-0 text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                                        {label}
                                    </span>
                                    <ScoreBar
                                        value={value}
                                        max={100}
                                        color={tierStyle.bar}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {overall_score.summary && (
                        <p className='mt-10 border-l-2 border-(--brand-soft-border) pl-5 text-xl leading-relaxed text-muted-foreground italic'>
                            &ldquo;{overall_score.summary}&rdquo;
                        </p>
                    )}
                </Card>

                <Card>
                    <SectionLabel>Overview</SectionLabel>
                    <div className='grid gap-10 sm:grid-cols-2'>
                        <div>
                            <p className='mb-1 text-sm font-medium text-foreground'>
                                Candidate
                            </p>
                            <p className='mb-3 text-xs text-muted-foreground'>
                                {candidate_profile.seniority_level} ·{' '}
                                {candidate_profile.years_of_experience} yrs
                                experience
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {candidate_profile.main_roles.map((r) => (
                                    <Tag key={r} label={r} />
                                ))}
                                {candidate_profile.main_technologies.map(
                                    (t) => (
                                        <Tag key={t} label={t} />
                                    ),
                                )}
                            </div>
                        </div>

                        <div>
                            <p className='mb-1 text-sm font-medium text-foreground'>
                                {job_analysis.job_title}
                            </p>
                            <p className='mb-3 text-xs text-muted-foreground'>
                                Seniority required:{' '}
                                {job_analysis.seniority_required}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {job_analysis.required_skills.map((s) => (
                                    <Tag
                                        key={s.skill}
                                        label={s.skill}
                                    />
                                ))}

                                {job_analysis.preferred_skills.map((s) => (
                                    <Tag
                                        key={s.skill}
                                        label={`${s.skill} (nice-to-have)`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <SectionLabel>Evidence</SectionLabel>
                    <div className='grid gap-10 sm:grid-cols-2'>
                        <div>
                            <p className='mb-3 text-sm font-medium text-foreground'>
                                Strengths{' '}
                                <span className='font-normal text-muted-foreground'>
                                    ({strengths.length})
                                </span>
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {strengths.map((s) => (
                                    <Chip
                                        key={s}
                                        label={s}
                                        variant='strength'
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className='mb-3 text-sm font-medium text-foreground'>
                                Weaknesses{' '}
                                <span className='font-normal text-muted-foreground'>
                                    ({weaknesses.length})
                                </span>
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {weaknesses.map((w) => (
                                    <Chip key={w} label={w} variant='gap' />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <SectionLabel>Skills breakdown</SectionLabel>
                    <div className='space-y-10'>
                        <div>
                            <p className='mb-3 text-sm font-medium text-foreground'>
                                Matched{' '}
                                <span className='font-normal text-muted-foreground'>
                                    ({skills_analysis.matched_skills.length})
                                </span>
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {skills_analysis.matched_skills.map((s) => (
                                    <Chip
                                        key={s.skill}
                                        label={`${s.skill} · ${s.importance}`}
                                        variant='strength'
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className='mb-3 text-sm font-medium text-foreground'>
                                Missing{' '}
                                <span className='font-normal text-muted-foreground'>
                                    ({skills_analysis.missing_skills.length})
                                </span>
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {skills_analysis.missing_skills.map((s) => (
                                    <Chip
                                        key={s.skill}
                                        label={`${s.skill} · ${s.importance}`}
                                        variant='gap'
                                    />
                                ))}
                            </div>
                        </div>

                        {skills_analysis.partial_matches.length > 0 && (
                            <div>
                                <p className='mb-3 text-sm font-medium text-foreground'>
                                    Partial matches{' '}
                                    <span className='font-normal text-muted-foreground'>
                                        (
                                        {
                                            skills_analysis.partial_matches
                                                .length
                                        }
                                        )
                                    </span>
                                </p>
                                <ul className='space-y-4'>
                                    {skills_analysis.partial_matches.map(
                                        (p) => (
                                            <li
                                                key={p.skill}
                                                className='rounded-lg border border-border bg-muted/40 p-4 text-sm'>
                                                <p className='font-medium text-foreground'>
                                                    {p.skill}{' '}
                                                    <span className='text-xs font-normal text-muted-foreground'>
                                                        ({p.candidate_level} →{' '}
                                                        {p.required_level})
                                                    </span>
                                                </p>
                                                <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
                                                    {p.gap}
                                                </p>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </Card>

                {project_analysis.length > 0 && (
                    <Card>
                        <SectionLabel>Project relevance</SectionLabel>
                        <div className='space-y-8'>
                            {project_analysis.map((project) => {
                                const projectTier = tier(
                                    project.relevance_score,
                                );
                                return (
                                    <div
                                        key={project.project_name}
                                        className='rounded-lg border border-border bg-muted/40 p-5'>
                                        <div className='flex items-center gap-4'>
                                            <span className='flex-1 text-sm font-medium text-foreground'>
                                                {project.project_name}
                                            </span>
                                            <ScoreBar
                                                value={
                                                    project.relevance_score
                                                }
                                                max={100}
                                                color={projectTier.bar}
                                            />
                                        </div>
                                        <p className='mt-3 text-xs leading-relaxed text-muted-foreground'>
                                            {project.explanation}
                                        </p>
                                        <div className='mt-3 flex flex-wrap gap-2'>
                                            {project.matched_requirements.map(
                                                (r) => (
                                                    <Chip
                                                        key={r}
                                                        label={r}
                                                        variant='strength'
                                                    />
                                                ),
                                            )}
                                            {project.missing_requirements.map(
                                                (r) => (
                                                    <Chip
                                                        key={r}
                                                        label={r}
                                                        variant='gap'
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                )}

                <Card>
                    <SectionLabel>ATS compatibility</SectionLabel>
                    <div className='space-y-8'>
                        {ats_analysis.missing_keywords.length > 0 && (
                            <div>
                                <p className='mb-3 text-sm font-medium text-foreground'>
                                    Missing keywords
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    {ats_analysis.missing_keywords.map(
                                        (k) => (
                                            <Tag key={k} label={k} />
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                        {ats_analysis.ats_issues.length > 0 && (
                            <div>
                                <p className='mb-3 text-sm font-medium text-foreground'>
                                    Issues
                                </p>
                                <ul className='space-y-2'>
                                    {ats_analysis.ats_issues.map((issue) => (
                                        <li
                                            key={issue}
                                            className='flex items-start gap-2 text-sm text-muted-foreground'>
                                            <XCircle className='mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive' />
                                            {issue}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Card>

                {cv_improvement_suggestions.length > 0 && (
                    <Card>
                        <SectionLabel>Fixes</SectionLabel>
                        <ol className='divide-y divide-border'>
                            {cv_improvement_suggestions.map(
                                (suggestion, i) => (
                                    <li
                                        key={i}
                                        className='flex gap-5 py-6 first:pt-0 last:pb-0'>
                                        <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--brand-soft) font-mono text-xs font-semibold text-(--brand-foreground)'>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <p className='text-sm font-medium text-foreground'>
                                                {suggestion.section}
                                            </p>
                                            <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                                                {suggestion.current_problem}
                                            </p>
                                            <p className='mt-2 text-sm leading-relaxed text-(--brand-foreground)'>
                                                {suggestion.suggested_change}
                                            </p>
                                        </div>
                                    </li>
                                ),
                            )}
                        </ol>
                    </Card>
                )}

                <Card>
                    <SectionLabel>Final recommendation</SectionLabel>
                    <div>
                        <div className='flex flex-wrap items-center gap-4'>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
                                    final_recommendation.should_apply
                                        ? 'border-(--success-soft-border) bg-(--success-soft) text-(--success-foreground)'
                                        : 'border-(--destructive-soft-border) bg-(--destructive-soft) text-destructive'
                                }`}>
                                {final_recommendation.should_apply ? (
                                    <CheckCircle2 className='h-4 w-4' />
                                ) : (
                                    <XCircle className='h-4 w-4' />
                                )}
                                {final_recommendation.should_apply
                                    ? 'Worth applying'
                                    : 'Not recommended'}
                            </span>
                            <span className='text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                                Confidence: {final_recommendation.confidence}%
                            </span>
                        </div>
                        <p className='mt-6 border-l-2 border-(--brand-soft-border) pl-5 text-sm leading-relaxed text-muted-foreground'>
                            {final_recommendation.reasoning}
                        </p>
                    </div>
                </Card>

                <Button
                    className='h-12 w-full text-[0.95rem]'
                    onClick={() => router.push('/')}>
                    Analyze another résumé
                </Button>
            </div>
        </div>
    );
}
