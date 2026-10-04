import type { AnalysisResult } from '@/lib/schemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type { AnalysisResult };

export const MAX_HISTORY_ITEMS = 20;

export type AnalysisHistoryItem = {
    id: string;
    createdAt: string;
    fileName?: string;
    jobTitle?: string;
    result: AnalysisResult;
};

type AddToHistoryInput = {
    result: AnalysisResult;
    fileName?: string;
    jobTitle?: string;
};

type Store = {
    result: AnalysisResult | null;
    isLoading: boolean;
    hasHydrated: boolean;
    history: AnalysisHistoryItem[];

    setResult: (data: AnalysisResult) => void;
    setLoading: (v: boolean) => void;
    setHasHydrated: (v: boolean) => void;
    addToHistory: (item: AddToHistoryInput) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
    getHistoryItem: (id: string) => AnalysisHistoryItem | undefined;
    clear: () => void;
};

export const useAnalysisStore = create<Store>()(
    persist(
        (set, get) => ({
            result: null,
            isLoading: false,
            hasHydrated: false,
            history: [],

            setResult: (data) => set({ result: data }),
            setLoading: (v) => set({ isLoading: v }),
            setHasHydrated: (v) => set({ hasHydrated: v }),

            addToHistory: ({ result, fileName, jobTitle }) =>
                set((state) => {
                    const item: AnalysisHistoryItem = {
                        id: result.id,
                        createdAt: new Date().toISOString(),
                        fileName,
                        jobTitle: jobTitle ?? result.job_analysis.job_title,
                        result,
                    };

                    const history = [
                        item,
                        ...state.history.filter((entry) => entry.id !== item.id),
                    ]
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .slice(0, MAX_HISTORY_ITEMS);

                    return { history };
                }),

            removeFromHistory: (id) =>
                set((state) => ({
                    history: state.history.filter((entry) => entry.id !== id),
                })),

            clearHistory: () => set({ history: [] }),

            getHistoryItem: (id) =>
                get().history.find((entry) => entry.id === id),

            clear: () => set({ result: null }),
        }),
        {
            name: 'analysis-store',
            // client-localstorage-schema: version the persisted payload so a
            // future shape change can migrate instead of crashing on stale data.
            version: 1,
            partialize: (state) => ({
                result: state.result,
                history: state.history,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
