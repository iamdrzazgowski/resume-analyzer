import { X } from 'lucide-react';
import { UploadIcon } from './ui/upload-icon';

export default function UploadedFilePreview({
    file,
    onRemove,
}: {
    file: File;
    onRemove: () => void;
}) {
    return (
        <div className='flex items-center gap-3 px-5 py-4'>
            <div
                className='flex h-10 w-10 shrink-0 items-center
                justify-center rounded-full bg-(--brass-dim)'>
                <UploadIcon className='h-5 w-5 text-(--brass-soft)' />
            </div>
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm text-foreground'>{file.name}</p>
                <p className='font-mono text-[11px] text-muted-foreground'>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>
            <button
                type='button'
                onClick={onRemove}
                className='rounded-md p-1.5 text-muted-foreground
                             transition-colors hover:bg-muted hover:text-foreground'
                aria-label='Remove file'>
                <X className='h-4 w-4' />
            </button>
        </div>
    );
}
