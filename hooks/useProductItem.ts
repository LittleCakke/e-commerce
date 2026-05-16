import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import type { Product } from "@/type";

const useProductItem = (productId: string) =>
{
    let api = useApi();
    let result = useQuery<Product>({
        queryKey: ["product", productId],
        queryFn: async () =>
        {
            let { data } = await api.get(`/product/${productId}`);
            return data;
        },
        enabled: !!productId
    });

    return result;
}

export default useProductItem;