export default function ScoreBar({
    value,
    max,
    color,
}: {
    value: number;
    max: number;
    color: string;
}) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className='flex items-center gap-3'>
            <div className='flex-1 h-1 rounded-full bg-muted overflow-hidden'>
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className='text-xs text-muted-foreground w-10 text-right tabular-nums'>
                {value}/{max}
            </span>
        </div>
    );
}
