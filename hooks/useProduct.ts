import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import type { Product } from "@/type";

const useProduct = () =>
{
    const api = useApi();

    return useQuery({
        queryKey: ["products"],
        queryFn: async () =>
        {
            let res = await api.get<Product[]>("/product");
            return res.data;
        }
    });
}

export default useProduct;