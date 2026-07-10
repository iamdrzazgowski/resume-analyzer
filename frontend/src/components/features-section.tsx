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
        <section
            id='what-you-get'
            className='border-t border-border bg-card/40'>
            <div className='mx-auto max-w-6xl px-6 py-28 md:px-10'>
                <div className='mb-16 max-w-lg'>
                    <p className='mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                        What you get
                    </p>
                    <h2 className='text-balance font-heading text-4xl leading-tight text-foreground md:text-[2.75rem]'>
                        Precision, where advice used to be.
                    </h2>
                </div>

                <div className='divide-y divide-border'>
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className='grid grid-cols-1 gap-4 py-9 md:grid-cols-[1fr_1.4fr] md:gap-16'>
                            <h3 className='font-heading text-2xl text-foreground md:text-[1.9rem]'>
                                {feature.title}
                            </h3>
                            <p className='max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground'>
                                {feature.detail}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
