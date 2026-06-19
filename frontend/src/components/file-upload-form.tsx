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
import { X } from 'lucide-react';
import LoadingAnalyze from './ui/loading';

export function FileUploadForm() {
    const [isDragging, setIsDragging] = useState(false);
    const {
        analyzeResume,
        error: mutationError,
        isPending,
    } = useAnalyzeMutation();

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
        <div className='relative'>
            {isPending && <LoadingAnalyze />}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`space-y-6 transition-opacity ${isPending ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className='space-y-2'>
                    <Label className='text-sm font-medium text-foreground'>
                        Resume file
                    </Label>

                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl transition-colors
                        ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}
                        ${uploadedFile ? 'border-solid border-primary/60' : ''}
                        `}>
                        {uploadedFile ? (
                            <div className='flex items-center gap-3 px-5 py-4'>
                                <div
                                    className='w-10 h-10 rounded-full bg-primary/10 flex items-center
                                justify-center shrink-0'>
                                    <UploadIcon className='w-5 h-5 text-primary' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-foreground truncate'>
                                        {uploadedFile.name}
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
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
                                    className='p-1.5 rounded-md text-muted-foreground hover:text-foreground
                             hover:bg-muted transition-colors'
                                    aria-label='Usuń plik'>
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                        ) : (
                            <label
                                className='flex flex-col items-center justify-center text-center
                                cursor-pointer p-8'>
                                <input
                                    type='file'
                                    className='sr-only'
                                    accept='.pdf'
                                    onChange={handleFileInputChange}
                                />
                                <div
                                    className='w-16 h-16 rounded-full bg-primary/10 flex items-center
                                justify-center mb-4'>
                                    <UploadIcon className='w-8 h-8 text-primary' />
                                </div>
                                <p className='text-foreground font-medium mb-1'>
                                    Drag and drop the file here
                                </p>
                                <p className='text-sm text-muted-foreground mb-3'>
                                    or click to browse files
                                </p>
                                <span
                                    className='text-xs text-muted-foreground/70 bg-muted
                                 px-3 py-1 rounded-full'>
                                    PDF • Max 10MB
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

                {mutationError && (
                    <p className='text-sm text-destructive'>
                        {mutationError.message}
                    </p>
                )}

                <Button
                    type='submit'
                    disabled={isPending}
                    className='w-full h-12 text-base font-medium rounded-xl
                     bg-primary text-primary-foreground cursor-pointer'>
                    <span className='flex items-center gap-2'>
                        Submit application
                    </span>
                </Button>
            </form>
        </div>
    );
}
