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
                <p className='mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                    Method
                </p>
                <h2 className='text-balance font-heading text-4xl leading-tight text-foreground md:text-[2.75rem]'>
                    Three steps. No guesswork.
                </h2>
            </div>

            <div className='grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-10'>
                {STEPS.map((step) => (
                    <div
                        key={step.number}
                        className='border-t border-border pt-6'>
                        <span className='font-mono text-sm text-(--brass-soft)'>
                            {step.number}
                        </span>
                        <h3 className='mt-4 text-xl text-foreground'>
                            {step.title}
                        </h3>
                        <p className='mt-3 text-[0.95rem] leading-relaxed text-muted-foreground'>
                            {step.detail}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
