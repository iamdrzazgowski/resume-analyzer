import { create } from 'zustand';

export type AnalysisResult = {
    id: string;
    score: number;
    score_breakdown: {
        required_skills: number;
        experience_level: number;
        project_relevance: number;
    };
    strengths: string[];
    gaps: string[];
    suggestions: string[];
    scoring_notes: string;
};

type Store = {
    result: AnalysisResult | null;
    setResult: (data: AnalysisResult) => void;
    clear: () => void;
};

export const useAnalysisStore = create<Store>((set) => ({
    result: null,
    setResult: (data) => set({ result: data }),
    clear: () => set({ result: null }),
}));
