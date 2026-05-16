import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState } from "react";
import AddressFormModal from "@/components/AddressFormModal";
import ErrorUI from "@/components/ErrorUI";
import LoadingUI from "@/components/LoadingUI";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";
import useAddress from "@/hooks/useAddress";
import { Ionicons } from "@expo/vector-icons";
import type { Address } from "@/type";
import AddressCard from "@/components/AddressCard";

export default function Page()
{
    let {
        addAddress,
        addresses,
        deleteAddress,
        isAddingAddress,
        isDeletingAddress,
        isError,
        isLoading,
        isUpdatingAddress,
        updateAddress
    } = useAddress();

    let [showAddressModal, setShowAddressModal] = useState(false);
    let [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    let [addressForm, setAddressForm] = useState<Omit<Address, "_id">>({
        label: "",
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        isDefault: false,
    });

    // region methods
    const addAddressHandler = () =>
    {
        setShowAddressModal(true);
        setEditingAddressId(null);
        setAddressForm({
            label: "",
            fullName: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            phoneNumber: "",
            isDefault: false,
        });
    }

    const editAddressHandler = (address: Address) =>
    {
        setShowAddressModal(true);
        setEditingAddressId(address._id);
        setAddressForm({
            label: address.label,
            fullName: address.fullName,
            streetAddress: address.streetAddress,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            phoneNumber: address.phoneNumber,
            isDefault: address.isDefault,
        });
    }

    const deleteAddressHandler = (addressId: string, label: string) =>
    {
        Alert.alert("Delete Address", `Are you sure ou want to delete {${label}}`, [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteAddress(addressId)
            }
        ]);
    }

    const saveAddressHandler = () =>
    {
        Object.values(addressForm).forEach(value =>
        {
            if (value == undefined || (typeof value === "string" && !value))
            {
                Alert.alert("Error", "Please fill in all fields");
                return;
            }
        });

        if (editingAddressId)
        {
            // update an existing address
            updateAddress({ addressId: editingAddressId, addressData: addressForm }, {
                onSuccess()
                {
                    setShowAddressModal(false);
                    setEditingAddressId(null);
                    Alert.alert("Success", "Address updated successfully");
                },
                onError: (e: any) => Alert.alert("Error", e?.response?.data?.error || "Failed to update address")
            });
        }
        else
        {
            // create a new address
            addAddress(addressForm, {
                onSuccess()
                {
                    setShowAddressModal(false);
                    setEditingAddressId(null);
                    Alert.alert("Success", "Address created successfully");
                },
                onError: (e: any) => Alert.alert("Error", e?.response?.data?.error || "Failed to create address")
            });
        }
    }

    const closeAddressModalHandler = () =>
    {
        setShowAddressModal(false);
        setEditingAddressId(null);
    }
    // endregion

    if (isLoading) return <LoadingUI title="Address" />;

    if (isError) return <ErrorUI title="Address" />;

    return (
        <SafeScreen>
            <ScreenHeader title="Address" />
            {addresses.length === 0 ? (
                <View
                    className="flex-1 items-center justify-center px-6">
                    <Ionicons name="location-outline" size={80} color="#666" />
                    <Text
                        className="text-text-primary font-semibold text-xl mt-4">
                        No addresses yet
                    </Text>
                    <Text
                        className="text-text-secondary text-center mt-2">
                        Add your first delivery address
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={addAddressHandler}
                        className="bg-primary rounded-2xl px-8 py-4 mt-6">
                        <Text
                            className="text-background font-bold text-base">
                            Add Address
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}>
                    <View
                        className="px-6 py-4">
                        {addresses.map(address => (
                            <AddressCard
                                key={address._id}
                                address={address}
                                onEdit={editAddressHandler}
                                onDelete={deleteAddressHandler}
                                isUpdatingAddress={isUpdatingAddress}
                                isDeletingAddress={isDeletingAddress}
                            />
                        ))}

                        <TouchableOpacity
                            className="bg-primary rounded-2xl py-4 items-center mt-2"
                            activeOpacity={0.8}
                            onPress={addAddressHandler}>
                            <View
                                className="flex-row items-center gap-2">
                                <Ionicons name="add-circle-outline" size={24} color={"#121212"} />
                                <Text
                                    className="text-background font-bold text-base">
                                    Add New Address
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            <AddressFormModal
                visible={showAddressModal}
                isEditing={!!editingAddressId}
                addressForm={addressForm}
                isAddingAddress={isAddingAddress}
                isUpdatingAddress={isUpdatingAddress}
                onClose={closeAddressModalHandler}
                onSave={saveAddressHandler}
                onFormChange={setAddressForm}
            />
        </SafeScreen>
    );
}