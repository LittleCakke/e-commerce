import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import type { Product } from "@/type";

const useWishlist = () =>
{
    let api = useApi();
    let queryClient = useQueryClient();

    let { data: wishlist, isLoading, isError } = useQuery({
        queryKey: ["wishlist"],
        queryFn: async () =>
        {
            let { data } = await api.get<{wishlist: Product[] }>("/user/wishlist");
            return data.wishlist;
        }
    });

    let addToWishlistMutation = useMutation({
        mutationFn: async (productId: string) =>
        {
            let { data } = await api.post<{ wishlist: string[] }>("/user/wishlist", { productId });
            return data.wishlist;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] })
    });

    let removeFromWishlistMutation = useMutation({
        mutationFn: async (productId: string) =>
        {
            let { data } = await api.delete<{ wishlist: string[] }>(`/user/wishlist/${productId}`);
            return data.wishlist;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] })
    });

    const isInWishlist = (productId: string) =>
    {
        return wishlist?.some(product => product._id === productId) ?? false;
    }

    const toggleWishlist = (productId: string) =>
    {
        if (isInWishlist(productId))
            removeFromWishlistMutation.mutate(productId);
        else
            addToWishlistMutation.mutate(productId);
    }

    return {
        wishlist: wishlist || [],
        isLoading,
        isError,
        wishlistCount: wishlist?.length || 0,
        isInWishlist,
        toggleWishlist,
        addToWishlist: addToWishlistMutation.mutate,
        removeFromWishlist: removeFromWishlistMutation.mutate,
        isAddingToWishlist: addToWishlistMutation.isPending,
        isRemovingFromWishlist: removeFromWishlistMutation.isPending
    }
}

export default useWishlist;