import { useAnalysisStore } from '@/store/analysisStore';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type AnalyzeVariables = {
    file: File;
    jobOffer: string;
};

async function analyzeCV({ file, jobOffer }: AnalyzeVariables) {
    const formData = new FormData();

    formData.append('resume_file', file);
    formData.append('job_description', jobOffer);

    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/analyze`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    return response.data;
}

export function useAnalyzeMutation() {
    const router = useRouter();

    const setResult = useAnalysisStore((s) => s.setResult);
    const setLoading = useAnalysisStore((s) => s.setLoading);

    const { mutate: analyzeResume, error } = useMutation({
        mutationFn: analyzeCV,
        mutationKey: ['analyze'],

        onMutate: () => {
            setLoading(true);
        },

        onSuccess: (data) => {
            setResult(data);
            router.push(`/results/${data.id}`);
        },

        onError: () => {
            setLoading(false);
        },
    });

    return { analyzeResume, error };
}
