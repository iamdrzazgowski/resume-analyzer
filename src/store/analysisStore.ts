import type { AnalysisResult } from '@/lib/schemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type { AnalysisResult };

type Store = {
    result: AnalysisResult | null;
    isLoading: boolean;
    hasHydrated: boolean;

    setResult: (data: AnalysisResult) => void;
    setLoading: (v: boolean) => void;
    setHasHydrated: (v: boolean) => void;
    clear: () => void;
};

export const useAnalysisStore = create<Store>()(
    persist(
        (set) => ({
            result: null,
            isLoading: false,
            hasHydrated: false,

            setResult: (data) => set({ result: data }),
            setLoading: (v) => set({ isLoading: v }),
            setHasHydrated: (v) => set({ hasHydrated: v }),

            clear: () => set({ result: null }),
        }),
        {
            name: 'analysis-store',
            partialize: (state) => ({
                result: state.result,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
