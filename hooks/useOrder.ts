import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import type { Order } from "@/type";

export const useOrder = () =>
{
    let api = useApi();

    return useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: async () =>
        {
            let { data } = await api.get<{ orders: Order[] }>("/order");
            return data.orders
        }
    });
}