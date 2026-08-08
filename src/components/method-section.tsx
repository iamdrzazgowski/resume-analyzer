const STEPS = [
    {
        number: '01',
        title: 'Upload your résumé',
        detail:
            'PDF, straight from your applications folder. Nothing is stored beyond this session.',
    },
    {
        number: '02',
        title: 'Paste the job description',
        detail:
            'The exact posting you\u2019re applying to, not a generic template. The details are what make the score accurate.',
    },
    {
        number: '03',
        title: 'Get your verdict',
        detail:
            'A scored breakdown of required skills, experience level and project relevance, with concrete fixes.',
    },
];

export function MethodSection() {
    return (
        <section id='method' className='mx-auto max-w-6xl px-6 py-28 md:px-10'>
            <div className='mb-16 max-w-lg'>
                <p className='mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                    <span
                        aria-hidden
                        className='h-1.5 w-1.5 rounded-full bg-(--brand)'
                    />
                    Method
                </p>
                <h2 className='text-balance text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-[2.5rem]'>
                    Three steps. No guesswork.
                </h2>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {STEPS.map((step) => (
                    <div
                        key={step.number}
                        className='rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md'>
                        <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--brand-soft) font-mono text-sm font-semibold text-(--brand-foreground)'>
                            {step.number}
                        </span>
                        <h3 className='mt-5 text-lg font-semibold text-foreground'>
                            {step.title}
                        </h3>
                        <p className='mt-2.5 text-[0.95rem] leading-relaxed text-muted-foreground'>
                            {step.detail}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
