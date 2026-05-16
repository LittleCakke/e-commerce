import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import type { CreateReviewData, Review } from "@/type";

export const useReview = () =>
{
    let api = useApi();
    let queryClient = useQueryClient();

    const createReview = useMutation({
        mutationFn: async (review: CreateReviewData) =>
        {
            let { data } = await api.post<{ review: Review }>("/review", review);
            return data;
        },

        onSuccess()
        {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
    });

    return {
        isCreatingReview: createReview.isPending,
        createReviewAsync: createReview.mutateAsync
    }
}