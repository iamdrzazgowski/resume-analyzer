'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useId, useRef } from 'react';

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    onClose: () => void;
};

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    const titleId = useId();
    const descriptionId = useId();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        cancelRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-6'>
            <button
                type='button'
                aria-label='Close dialog'
                className='absolute inset-0 bg-background/80 backdrop-blur-sm'
                onClick={onClose}
            />
            <div
                role='alertdialog'
                aria-modal='true'
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className='relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-md'>
                <h2
                    id={titleId}
                    className='text-lg font-semibold tracking-tight text-foreground'>
                    {title}
                </h2>
                <p
                    id={descriptionId}
                    className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                    {description}
                </p>
                <div className='mt-6 flex justify-end gap-2'>
                    <Button
                        ref={cancelRef}
                        type='button'
                        variant='outline'
                        onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
