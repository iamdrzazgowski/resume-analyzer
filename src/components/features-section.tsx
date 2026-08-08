const FEATURES = [
    {
        title: 'A score you can defend',
        detail:
            'Not a black box. Every match score breaks down into required skills, experience level and project relevance, so you know exactly where you stand.',
    },
    {
        title: 'Evidence, not opinions',
        detail:
            'See the strengths that support your application and the gaps that don\u2019t, pulled directly from your résumé against the job description.',
    },
    {
        title: 'Fixes, not feelings',
        detail:
            'Specific, ordered suggestions for closing the gaps, so you can rewrite before you resubmit, not after you\u2019re rejected.',
    },
];

export function FeaturesSection() {
    return (
        <section id='what-you-get' className='border-t border-border bg-muted/30'>
            <div className='mx-auto max-w-6xl px-6 py-28 md:px-10'>
                <div className='mb-16 max-w-lg'>
                    <p className='mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                        <span
                            aria-hidden
                            className='h-1.5 w-1.5 rounded-full bg-(--brand)'
                        />
                        What you get
                    </p>
                    <h2 className='text-balance text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-[2.5rem]'>
                        Precision, where advice used to be.
                    </h2>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className='rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md'>
                            <h3 className='text-lg font-semibold text-foreground'>
                                {feature.title}
                            </h3>
                            <p className='mt-2.5 text-[0.95rem] leading-relaxed text-muted-foreground'>
                                {feature.detail}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
