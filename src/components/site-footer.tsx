export function SiteFooter() {
    return (
        <footer className='border-t border-border'>
            <div className='mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center md:flex-row md:justify-between md:px-10 md:text-left'>
                <span className='font-mono text-[12px] tracking-[0.16em] text-muted-foreground'>
                    VERDICT
                </span>
                <p className='text-xs text-muted-foreground'>
                    Your résumé and the job description are used only to
                    generate your analysis, and are not retained afterward.
                </p>
                <span className='text-xs text-muted-foreground/70'>
                    © {new Date().getFullYear()} Verdict
                </span>
            </div>
        </footer>
    );
}
