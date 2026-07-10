import { CheckCircle2, XCircle } from 'lucide-react';

export default function Chip({
    label,
    variant,
}: {
    label: string;
    variant: 'strength' | 'gap';
}) {
    const isStrength = variant === 'strength';
    const Icon = isStrength ? CheckCircle2 : XCircle;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                isStrength
                    ? 'border-(--brass-dim) bg-(--brass-dim) text-(--brass-soft)'
                    : 'border-border bg-muted/60 text-muted-foreground'
            }`}>
            <Icon className='h-3 w-3' />
            {label}
        </span>
    );
}
