'use client';

import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { UploadIcon } from './ui/upload-icon';
import { FormData } from '@/lib/types';
import { useCallback, useState } from 'react';
import { isValidFile } from '@/lib/validators';
import { useAnalyzeMutation } from '@/hooks/useAnalyzeMutation';
import { ArrowRight, X } from 'lucide-react';
import LoadingAnalyze from './ui/loading-analyze';
import { useAnalysisStore } from '@/store/analysisStore';

const FIELD_LABEL =
    'font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground';

export function FileUploadForm() {
    const [isDragging, setIsDragging] = useState(false);
    const { analyzeResume, error: mutationError } = useAnalyzeMutation();
    const isLoading = useAnalysisStore((s) => s.isLoading);

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

    const onSubmit = (data: FormData) => {
        if (!data.file) return;

        analyzeResume({ file: data.file, jobOffer: data.jobOffer });
    };

    return (
        <>
            {isLoading && <LoadingAnalyze />}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`w-full max-w-xl min-w-0 space-y-8 transition-opacity ${isLoading ? 'pointer-events-none opacity-40' : ''}`}>
                <div className='space-y-2.5'>
                    <Label className={FIELD_LABEL}>Résumé</Label>

                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative rounded-lg border transition-colors
                        ${
                            isDragging
                                ? 'border-(--brass) bg-(--brass-dim)'
                                : 'border-border bg-muted/20'
                        }
                        ${uploadedFile ? 'border-(--brass-dim)' : 'border-dashed'}
                        `}>
                        {uploadedFile ? (
                            <div className='flex items-center gap-3 px-5 py-4'>
                                <div
                                    className='flex h-10 w-10 shrink-0 items-center
                                justify-center rounded-full bg-(--brass-dim)'>
                                    <UploadIcon className='h-5 w-5 text-(--brass-soft)' />
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate text-sm text-foreground'>
                                        {uploadedFile.name}
                                    </p>
                                    <p className='font-mono text-[11px] text-muted-foreground'>
                                        {(
                                            uploadedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{' '}
                                        MB
                                    </p>
                                </div>
                                <button
                                    type='button'
                                    onClick={removeFile}
                                    className='rounded-md p-1.5 text-muted-foreground
                             transition-colors hover:bg-muted hover:text-foreground'
                                    aria-label='Remove file'>
                                    <X className='h-4 w-4' />
                                </button>
                            </div>
                        ) : (
                            <label
                                className='flex flex-col items-center justify-center text-center
                                cursor-pointer p-10'>
                                <input
                                    type='file'
                                    className='sr-only'
                                    accept='.pdf'
                                    onChange={handleFileInputChange}
                                />
                                <div
                                    className='mb-4 flex h-14 w-14 items-center
                                justify-center rounded-full bg-(--brass-dim)'>
                                    <UploadIcon className='h-6 w-6 text-(--brass-soft)' />
                                </div>
                                <p className='mb-1 text-[0.95rem] text-foreground'>
                                    Drag and drop your résumé
                                </p>
                                <p className='mb-4 text-sm text-muted-foreground'>
                                    or click to browse files
                                </p>
                                <span
                                    className='rounded-full bg-muted px-3 py-1 font-mono
                                 text-[10px] tracking-wide text-muted-foreground'>
                                    PDF · MAX 10MB
                                </span>
                            </label>
                        )}
                    </div>

                    {errors.file && (
                        <p className='text-sm text-destructive'>
                            {errors.file.message}
                        </p>
                    )}
                </div>

                <div className='w-full min-w-0 max-w-full space-y-2.5'>
                    <Label htmlFor='jobOffer' className={FIELD_LABEL}>
                        Job description
                    </Label>
                    <Textarea
                        id='jobOffer'
                        placeholder='Paste the job description you are applying to here'
                        className='h-45 resize-none overflow-x-hidden overflow-y-auto rounded-lg
                        border-border bg-muted/20 whitespace-pre-wrap wrap-break-word
                        focus-visible:border-(--brass-dim) focus-visible:ring-(--brass-dim)'
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

                {mutationError && (
                    <p className='text-sm text-destructive'>
                        {mutationError.message}
                    </p>
                )}

                <Button
                    type='submit'
                    disabled={isLoading}
                    className='group h-12 w-full text-[0.95rem] font-medium'>
                    <span className='flex items-center gap-2'>
                        Get your verdict
                        <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                    </span>
                </Button>
            </form>
        </>
    );
}
