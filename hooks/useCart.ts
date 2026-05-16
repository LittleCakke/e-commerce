import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import type { Cart } from "@/type";

const useCart = () =>
{
    let api = useApi();
    let queryClient = useQueryClient();

    let { data: cart, isLoading, isError } = useQuery({
        queryKey: ["cart"],
        queryFn: async () =>
        {
            let { data } = await api.get<{ cart: Cart }>("/cart");
            return data.cart
        }
    });

    const addToCartMutation = useMutation({
        mutationFn: async ({ productId, quantity = 1 }: { productId: string, quantity?: number }) =>
        {
            let { data } = await api.post<{cart: Cart}>("/cart", { productId, quantity });
            return data.cart;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] })
    });

    let updateQuantityMutation = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) =>
        {
            let { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, { quantity });
            return data.cart;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] })
    });

    let removeFromCartMutation = useMutation({
        mutationFn: async (productId: string) =>
        {
            let { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
            return data.cart;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] })
    });

    let clearCartMutation = useMutation({
        mutationFn: async () =>
        {
            let { data } = await api.delete<{ cart: Cart }>("/cart");
            return data.cart
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] })
    });

    let cartTotal = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;
    let cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return {
        cart,
        isLoading,
        isError,
        cartTotal,
        cartItemCount,
        addToCart: addToCartMutation.mutate,
        updateQuantity: updateQuantityMutation.mutate,
        removeFromCart: removeFromCartMutation.mutate,
        clearCart: clearCartMutation.mutate,
        isAddingToCart: addToCartMutation.isPending,
        isUpdating: updateQuantityMutation.isPending,
        isRemoving: removeFromCartMutation.isPending,
        isClearing: clearCartMutation.isPending
    }
}

export default useCart;