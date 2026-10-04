'use client';

import dynamic from 'next/dynamic';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

// bundle-defer-third-party + bundle-dynamic-imports:
// devtools are only needed while developing — never bundle them for production.
const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then(
            (m) => m.ReactQueryDevtools,
          ),
        { ssr: false },
      )
    : () => null;

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
