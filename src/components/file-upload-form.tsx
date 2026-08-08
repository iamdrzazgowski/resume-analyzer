'use client';

import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAnalyzeMutation } from '@/hooks/useAnalyzeMutation';
import { useFileDropzone } from '@/hooks/useFileDropzone';
import { FormData } from '@/lib/types';
import { useAnalysisStore } from '@/store/analysisStore';
import { Button } from './ui/button';
import { Label } from './ui/label';
import LoadingAnalyze from './ui/loading-analyze';
import { Textarea } from './ui/textarea';
import EmptyDropzone from './empty-dropzone';
import UploadedFilePreview from './uploaded-file-preview';
import { useEffect } from 'react';

const FIELD_LABEL = 'text-sm font-medium text-foreground';

export function FileUploadForm() {
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

    const {
        isDragging,
        inputRef,
        removeFile,
        handleFileInputChange,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    } = useFileDropzone({
        hasFile: Boolean(uploadedFile),
        setValue,
        setError,
        clearErrors,
    });

    useEffect(() => {
        document.body.style.overflow = isLoading ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isLoading]);

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
                        className={`relative rounded-xl border transition-colors
                        ${
                            isDragging
                                ? 'border-(--brand) bg-(--brand-soft)'
                                : 'border-border bg-muted/30'
                        }
                        ${uploadedFile ? 'border-(--brand-soft-border) bg-(--brand-soft)' : 'border-dashed'}
                        `}>
                        {uploadedFile ? (
                            <UploadedFilePreview
                                file={uploadedFile}
                                onRemove={removeFile}
                            />
                        ) : (
                            <EmptyDropzone
                                inputRef={inputRef}
                                onChange={handleFileInputChange}
                            />
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
                        className='h-45 resize-none overflow-x-hidden overflow-y-auto rounded-xl
                        border-border bg-muted/30 whitespace-pre-wrap wrap-break-word
                        focus-visible:border-(--brand) focus-visible:ring-(--brand)/20'
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
