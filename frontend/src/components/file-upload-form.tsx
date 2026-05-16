import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { UploadIcon } from './ui/upload-icon';

export function FileUploadForm() {
    return (
        <form className='space-y-6'>
            <div className='space-y-2'>
                <Label className='text-sm font-medium text-foreground'>
                    Resume file
                </Label>
                <div className='relative border-2 border-dashed rounded-xl p-8 border-border bg-muted/30'>
                    <label className='flex flex-col items-center justify-center text-center cursor-pointer'>
                        <input type='file' className='sr-only' accept='.pdf' />
                        <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                            <UploadIcon className='w-8 h-8 text-primary' />
                        </div>
                        <p className='text-foreground font-medium mb-1'>
                            Drag and drop the file here
                        </p>
                        <p className='text-sm text-muted-foreground mb-3'>
                            or click to browse files
                        </p>
                        <span className='text-xs text-muted-foreground/70 bg-muted px-3 py-1 rounded-full'>
                            PDF • Max 10MB
                        </span>
                    </label>
                </div>
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
                />
            </div>

            <Button
                type='submit'
                className='w-full h-12 text-base font-medium rounded-xl bg-primary text-primary-foreground cursor-pointer'>
                <span className='flex items-center gap-2'>
                    Submit application
                </span>
            </Button>
        </form>
    );
}
