import { useCallback, useRef, useState } from 'react';
import type {
    UseFormClearErrors,
    UseFormSetError,
    UseFormSetValue,
} from 'react-hook-form';
import { FormData } from '@/lib/types';
import { isValidFile } from '@/lib/validators';

type UseFileDropzoneParams = {
    hasFile: boolean;
    setValue: UseFormSetValue<FormData>;
    setError: UseFormSetError<FormData>;
    clearErrors: UseFormClearErrors<FormData>;
};

export function useFileDropzone({
    hasFile,
    setValue,
    setError,
    clearErrors,
}: UseFileDropzoneParams) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const removeFile = useCallback(() => {
        setValue('file', null, { shouldValidate: false });
        clearErrors('file');
        if (inputRef.current) inputRef.current.value = '';
    }, [setValue, clearErrors]);

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) applyFile(file);
        },
        [applyFile],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!hasFile) setIsDragging(true);
        },
        [hasFile],
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) applyFile(file);
        },
        [applyFile],
    );

    return {
        isDragging,
        inputRef,
        removeFile,
        handleFileInputChange,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
}
