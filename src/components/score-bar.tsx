export default function ScoreBar({
    value,
    max,
    color,
}: {
    value: number;
    max: number;
    color: string;
}) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
        <div className='flex flex-1 items-center gap-3'>
            <div className='h-0.75 flex-1 overflow-hidden rounded-full bg-muted'>
                <div
                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className='w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground'>
                {value}/{max}
            </span>
        </div>
    );
}
