'use client';

import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { UploadIcon } from './ui/upload-icon';
import { FormData } from '@/lib/types';
import { useCallback, useState } from 'react';

const ACCEPTED = ['.pdf'];
const MAX_BYTES = 10 * 1024 * 1024;

function isValidFile(file: File): string | true {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) return 'Accepted format: PDF';
    if (file.size > MAX_BYTES) return 'File cannot be larger than 10 MB';
    return true;
}

export function FileUploadForm() {
    const [isDragging, setIsDragging] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            file: null,
            jobOffer: '',
        },
    });

    register('file', {
        validate: (v) => v instanceof File || 'Resume file is required',
    });

    const uploadedFile = watch('file');

    const applyFile = useCallback(
        (file: File) => {
            const result = isValidFile(file);
            if (result !== true) {
                setError('file', { message: result });
                return;
            }
            clearErrors('file');
            setValue('file', file, { shouldValidate: true });
        },
        [setValue, setError, clearErrors],
    );

    const removeFile = () => {
        setValue('file', null, { shouldValidate: false });
        clearErrors('file');
        const input =
            document.querySelector<HTMLInputElement>('input[type="file"]');
        if (input) input.value = '';
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) applyFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!uploadedFile) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) applyFile(file);
    };

    return (
        <form className='space-y-6'>
            <div className='space-y-2'>
                <Label className='text-sm font-medium text-foreground'>
                    Resume file
                </Label>
                <div className='relative border-2 border-dashed rounded-xl p-8 border-border bg-muted/30'>
                    <label className='flex flex-col items-center justify-center text-center cursor-pointer'>
                        <input type='file' className='sr-only' accept='.pdf' />
                        <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                            <UploadIcon className='w-8 h-8 text-primary' />
                        </div>
                        <p className='text-foreground font-medium mb-1'>
                            Drag and drop the file here
                        </p>
                        <p className='text-sm text-muted-foreground mb-3'>
                            or click to browse files
                        </p>
                        <span className='text-xs text-muted-foreground/70 bg-muted px-3 py-1 rounded-full'>
                            PDF • Max 10MB
                        </span>
                    </label>
                </div>
            </div>

            <div className='space-y-2'>
                <Label
                    htmlFor='jobOffer'
                    className='text-sm font-medium text-foreground'>
                    Job offer content
                </Label>
                <Textarea
                    id='jobOffer'
                    placeholder='Paste the text of the job posting you are applying for here...'
                    className='min-h-[180px] resize-none bg-muted/30 border-border rounded-xl'
                    {...register('jobOffer', {
                        required: 'Job offer content is required',
                        minLength: {
                            value: 50,
                            message: 'Please paste at least 50 characters',
                        },
                    })}
                />
                {errors.jobOffer && (
                    <p className='text-sm text-destructive'>
                        {errors.jobOffer.message}
                    </p>
                )}
            </div>

            <Button
                type='submit'
                className='w-full h-12 text-base font-medium rounded-xl bg-primary text-primary-foreground cursor-pointer'>
                <span className='flex items-center gap-2'>
                    Submit application
                </span>
            </Button>
        </form>
    );
}
