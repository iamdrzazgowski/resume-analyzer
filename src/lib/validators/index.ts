const ACCEPTED = ['.pdf'];
const MAX_BYTES = 10 * 1024 * 1024;

export function isValidFile(file: File): string | true {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) return 'Accepted format: PDF';
    if (file.size > MAX_BYTES) return 'File cannot be larger than 10 MB';
    return true;
}
