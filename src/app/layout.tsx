import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Verdict — Know the verdict before the recruiter does',
    description:
        'Paste a job description, upload your résumé, and get a precise, evidence-based match score with the exact gaps to fix before you apply.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='en'
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>

            <body className='min-h-full flex flex-col bg-background'>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
