import type { AnalysisResult } from '@/lib/schemas';
import { useAnalysisStore } from '@/store/analysisStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type AnalyzeVariables = {
    file: File;
    jobOffer: string;
};

async function analyzeCV({ file, jobOffer }: AnalyzeVariables) {
    // bundle-size: native fetch instead of axios (~30 kB saved, one less dep).
    const formData = new FormData();

    formData.append('resume_file', file);
    formData.append('job_description', jobOffer);

    const response = await fetch(`/api/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        const detail =
            typeof body?.detail === 'string' && body.detail.length > 0
                ? body.detail
                : `Analysis failed (HTTP ${response.status})`;
        throw new Error(detail);
    }

    return (await response.json()) as AnalysisResult;
}

export function useAnalyzeMutation() {
    const router = useRouter();

    const setResult = useAnalysisStore((s) => s.setResult);
    const setLoading = useAnalysisStore((s) => s.setLoading);
    const addToHistory = useAnalysisStore((s) => s.addToHistory);

    const { mutate: analyzeResume, error, isPending } = useMutation({
        mutationFn: analyzeCV,
        mutationKey: ['analyze'],

        onMutate: () => {
            setLoading(true);
        },

        onSuccess: (data, variables) => {
            setResult(data);
            addToHistory({
                result: data,
                fileName: variables.file.name,
                jobTitle: data.job_analysis.job_title,
            });
            router.push(`/results/${data.id}`);
        },

        onError: () => {
            setLoading(false);
        },
    });

    return { analyzeResume, error, isPending };
}
