export default function LoadingAnalyze() {
    return (
        <div
            className='
                fixed inset-0 z-9999
                flex flex-col items-center justify-center
                gap-6
                bg-background/95
                backdrop-blur-sm
            '>
            <div className='h-1 w-40 overflow-hidden rounded-full bg-muted'>
                <div className='h-full w-1/3 animate-loading-sweep rounded-full bg-(--brand)' />
            </div>

            <div className='flex flex-col items-center gap-2 text-center'>
                <p className='flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                    <span
                        aria-hidden
                        className='h-1.5 w-1.5 rounded-full bg-(--brand)'
                    />
                    Analyzing
                </p>
                <p className='text-2xl font-semibold tracking-tight text-foreground'>
                    Reading between the lines
                </p>
                <p className='text-sm text-muted-foreground'>
                    This usually takes a few seconds.
                </p>
            </div>
        </div>
    );
}
