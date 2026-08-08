import { FileUploadForm } from './file-upload-form';

export function AnalyzeSection() {
    return (
        <section id='analyze' className='border-t border-border'>
            <div className='mx-auto max-w-3xl px-6 py-28 md:px-10'>
                <div className='mb-12 text-center'>
                    <p className='mb-4 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                        <span
                            aria-hidden
                            className='h-1.5 w-1.5 rounded-full bg-(--brand)'
                        />
                        Start here
                    </p>
                    <h2 className='text-balance text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-[2.5rem]'>
                        Get your verdict
                    </h2>
                    <p className='mx-auto mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground'>
                        Two minutes now saves a rejection later.
                    </p>
                </div>

                <div className='rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10'>
                    <div className='flex justify-center'>
                        <FileUploadForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
