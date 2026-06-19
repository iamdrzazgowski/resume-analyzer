import { Loader2 } from 'lucide-react';

export default function LoadingAnalyze() {
    return (
        <div
            className='absolute inset-0 z-10 flex flex-col items-center justify-center
                        gap-3 rounded-2xl bg-background/80 backdrop-blur-sm'>
            <Loader2 className='h-7 w-7 animate-spin text-foreground' />
            <p className='text-sm font-medium text-foreground'>Analysing CV…</p>
            <p className='text-xs text-muted-foreground'>
                This may take a few seconds
            </p>
        </div>
    );
}
