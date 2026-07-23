import { FileUploadForm } from './file-upload-form';

export function AnalyzeSection() {
    return (
        <section id='analyze' className='border-t border-border'>
            <div className='mx-auto max-w-3xl px-6 py-28 md:px-10'>
                <div className='mb-12 text-center'>
                    <p className='mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                        Start here
                    </p>
                    <h2 className='text-balance font-heading text-4xl leading-tight text-foreground md:text-[2.75rem]'>
                        Get your verdict
                    </h2>
                    <p className='mx-auto mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground'>
                        Two minutes now saves a rejection later.
                    </p>
                </div>

                <div className='rounded-lg border border-border bg-card p-6 md:p-10'>
                    <div className='flex justify-center'>
                        <FileUploadForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
