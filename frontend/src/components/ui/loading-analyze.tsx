import { Loader2 } from 'lucide-react';

export default function LoadingAnalyze() {
    return (
        <div
            className='
                fixed inset-0 z-9999
                flex flex-col items-center justify-center
                gap-3
                bg-background/90
                backdrop-blur-sm
            '>
            <Loader2 className='h-7 w-7 animate-spin' />
            <p className='text-sm font-medium'>Analysing CV…</p>
            <p className='text-xs text-muted-foreground'>
                This may take a few seconds
            </p>
        </div>
    );
}
