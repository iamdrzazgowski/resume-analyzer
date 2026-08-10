'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './logo';

export function SiteHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className='sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md'>
            <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10'>
                <Link
                    href='#'
                    aria-label='Verdict home'
                    onClick={() => setOpen(false)}>
                    <Logo />
                </Link>

                <nav className='hidden items-center gap-8 md:flex'>
                    <a
                        href='#method'
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
                        Method
                    </a>
                    <a
                        href='#what-you-get'
                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
                        What you get
                    </a>
                </nav>

                <div className='flex items-center gap-3'>

                    <a
                        href='#analyze'
                        className='hidden h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 md:inline-flex'>
                        Get your verdict
                    </a>
                </div>

                <button
                    type='button'
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-label='Toggle menu'
                    className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted md:hidden'>
                    {open ? (
                        <X className='h-4 w-4' />
                    ) : (
                        <Menu className='h-4 w-4' />
                    )}
                </button>
            </div>

            <div
                className={`overflow-hidden border-t border-border bg-background transition-[max-height] duration-300 ease-in-out md:hidden ${
                    open ? 'max-h-64' : 'max-h-0 border-t-0'
                }`}>
                <nav className='flex flex-col gap-1 px-6 py-4'>
                    <a
                        href='#method'
                        onClick={() => setOpen(false)}
                        className='rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
                        Method
                    </a>
                    <a
                        href='#what-you-get'
                        onClick={() => setOpen(false)}
                        className='rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
                        What you get
                    </a>
                    <a
                        href='#analyze'
                        onClick={() => setOpen(false)}
                        className='mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'>
                        Get your verdict
                    </a>

                </nav>
            </div>
        </header>
    );
}
