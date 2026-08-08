const STATS = [
    { value: '<60s', label: 'Average time to a full analysis' },
    { value: '3', label: 'Dimensions scored: skills, experience, relevance' },
    { value: '0', label: 'Résumés stored after your session ends' },
];

export function StatsStrip() {
    return (
        <section className='border-y border-border bg-muted/30'>
            <div className='mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 sm:grid-cols-3 sm:divide-y-0 sm:divide-x md:px-10'>
                {STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className='flex flex-col gap-2 py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0'>
                        <span className='font-mono text-2xl font-semibold tabular-nums text-foreground'>
                            {stat.value}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
