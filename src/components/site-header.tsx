import Link from 'next/link';

export function SiteHeader() {
    return (
        <header className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md'>
            <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10'>
                <Link
                    href='#'
                    className='font-mono text-[13px] font-medium tracking-[0.18em] text-foreground'>
                    VERDICT
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
                    className='inline-flex h-8 items-center rounded-[calc(var(--radius)*0.8)] border border-border px-3.5 text-sm text-foreground transition-colors hover:border-(--brass-dim) hover:bg-(--brass-dim)'>
                    Get your verdict
                </a>
            </div>
        </header>
    );
}
