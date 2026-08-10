export function ScoreRing({
    value,
    color,
    size = 144,
    strokeWidth = 10,
}: {
    value: number;
    color: string;
    size?: number;
    strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, value));
    const offset = circumference * (1 - clamped / 100);

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className='-rotate-90 shrink-0'
            aria-hidden>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke='var(--border)'
                strokeWidth={strokeWidth}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className='transition-[stroke-dashoffset] duration-700 ease-out'
            />
        </svg>
    );
}
