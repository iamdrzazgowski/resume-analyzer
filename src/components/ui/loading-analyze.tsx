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
            <div className='h-px w-40 overflow-hidden bg-border'>
                <div className='h-full w-1/3 animate-loading-sweep bg-(--brass)' />
            </div>

            <div className='flex flex-col items-center gap-2 text-center'>
                <p className='flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                    <span
                        aria-hidden
                        className='h-1.5 w-1.5 rounded-full bg-(--brass)'
                    />
                    Analyzing
                </p>
                <p className='font-heading text-2xl text-foreground'>
                    Reading between the lines
                </p>
                <p className='text-sm text-muted-foreground'>
                    This usually takes a few seconds.
                </p>
            </div>
        </div>
    );
}
