import { UploadIcon } from './ui/upload-icon';

export default function EmptyDropzone({
    inputRef,
    onChange,
}: {
    inputRef: React.RefObject<HTMLInputElement | null>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <label className='flex flex-col items-center justify-center text-center cursor-pointer p-10'>
            <input
                ref={inputRef}
                type='file'
                className='sr-only'
                accept='.pdf'
                onChange={onChange}
            />
            <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brass-dim)'>
                <UploadIcon className='h-6 w-6 text-(--brass-soft)' />
            </div>
            <p className='mb-1 text-[0.95rem] text-foreground'>
                Drag and drop your resume
            </p>
            <p className='mb-4 text-sm text-muted-foreground'>
                or click to browse files
            </p>
            <span className='rounded-full bg-muted px-3 py-1 font-mono text-[10px] tracking-wide text-muted-foreground'>
                PDF · MAX 5MB
            </span>
        </label>
    );
}
