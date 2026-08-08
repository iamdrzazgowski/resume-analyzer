export function Logo({ className = '' }: { className?: string }) {
    return (
        <span
            className={`inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground ${className}`}>
            <span
                aria-hidden
                className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground'>
                V
            </span>
            Verdict
        </span>
    );
}
