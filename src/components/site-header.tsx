import Link from 'next/link';
import { Logo } from './logo';

export function SiteHeader() {
    return (
        <header className='sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md'>
            <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10'>
                <Link href='#' aria-label='Verdict home'>
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

                <a
                    href='#analyze'
                    className='inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'>
                    Get your verdict
                </a>
            </div>
        </header>
    );
}
