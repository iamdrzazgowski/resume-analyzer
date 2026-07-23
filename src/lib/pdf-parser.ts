import { extractText, getDocumentProxy } from 'unpdf';

export async function extractTextFromPdf(
    fileBytes: ArrayBuffer,
): Promise<string> {
    try {
        const pdf = await getDocumentProxy(new Uint8Array(fileBytes));
        const { text } = await extractText(pdf, { mergePages: true });
        return text.trim();
    } catch (error) {
        console.error('PDF parse error:', error);
        return '';
    }
}
