import { CheckCircle2, XCircle } from 'lucide-react';

export default function Chip({
    label,
    variant,
}: {
    label: string;
    variant: 'strength' | 'gap';
}) {
    const styles =
        variant === 'strength'
            ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200'
            : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200';
    const Icon = variant === 'strength' ? CheckCircle2 : XCircle;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs ${styles}`}>
            <Icon className='w-3 h-3' />
            {label}
        </span>
    );
}
