import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import type { Address } from "@/type";

const useAddress = () =>
{
    let api = useApi();
    let queryClient = useQueryClient();

    let {
        data: addresses,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["addresses"],
        queryFn: async () =>
        {
            let { data } = await api.get<{ addresses: Address[] }>("/user/addresses");
            return data.addresses;
        }
    });

    let addAddressMutation = useMutation({
        mutationFn: async (addressData: Omit<Address, "_id">) =>
        {
            let { data } = await api.post<{ addresses: Address[] }>("/user/addresses", addressData);
            return data.addresses;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] })
    });

    let updateAddressMutation = useMutation({
        mutationFn: async ({ addressId, addressData }: { addressId: string, addressData: Partial<Address>}) =>
        {
            let { data } = await api.put<{ addresses: Address[] }>(`/user/addresses/${addressId}`, addressData);
            return data.addresses;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] })
    });

    let deleteAddressMutation = useMutation({
        mutationFn: async (addressId: string) =>
        {
            let { data } = await api.delete<{ addresses: Address[] }>(`/user/addresses/${addressId}`);
            return data.addresses;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] })
    });

    return {
        addresses: addresses || [],
        isLoading,
        isError,
        addAddress: addAddressMutation.mutate,
        updateAddress: updateAddressMutation.mutate,
        deleteAddress: deleteAddressMutation.mutate,
        isAddingAddress: addAddressMutation.isPending,
        isUpdatingAddress: updateAddressMutation.isPending,
        isDeletingAddress: deleteAddressMutation.isPending
    }
}

export default useAddress;