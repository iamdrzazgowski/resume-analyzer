import type { AnalysisResult } from '@/lib/schemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type { AnalysisResult };

type Store = {
    result: AnalysisResult | null;
    isLoading: boolean;

    setResult: (data: AnalysisResult) => void;
    setLoading: (v: boolean) => void;
    clear: () => void;
};

export const useAnalysisStore = create<Store>()(
    persist(
        (set) => ({
            result: null,
            isLoading: false,

            setResult: (data) => set({ result: data }),
            setLoading: (v) => set({ isLoading: v }),

            clear: () => set({ result: null }),
        }),
        {
            name: 'analysis-store',
        },
    ),
);
