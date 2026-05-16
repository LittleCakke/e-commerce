import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CartScreenAddressCard from "@/components/CartScreenAddressCard";
import useAddress from "@/hooks/useAddress";
import type { Address, AddressSelectionModalProps } from "@/type";

export default function AddressSelectionModal({ visible, onClose, onProceed, isProcessing }: AddressSelectionModalProps)
{
    let { addresses, isLoading: addressesLoading } = useAddress();

    let [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}>
            <View
                className="flex-1 bg-black/50 justify-end">
                <View
                    className="bg-background rounded-t-3xl h-1/2">
                    {/* Modal Header */}
                    <View
                        className="flex-row items-center justify-between p-6">
                        <Text
                            className="text-white text-2xl font-bold">
                            Select Address
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-surface rounded-full p-2">
                            <Ionicons name="close" size={24} color={"#FFFFFF"} />
                        </TouchableOpacity>
                    </View>

                    {/* Addresses List */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="flex-1 p-6">
                        { addressesLoading ? (
                            <View
                                className="py-8">
                                <ActivityIndicator size="large" color={"#00D9FF"} />
                            </View>
                        ) : (
                            <View
                                className="gap-4 pb-6">
                                {addresses.map(address => (
                                    <CartScreenAddressCard
                                        key={address._id}
                                        address={address}
                                        selectedAddressId={selectedAddress?._id}
                                        setSelectedAddress={setSelectedAddress}
                                    />
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View
                        className="p-6">
                        <TouchableOpacity
                            className="bg-primary rounded-2xl py-5"
                            activeOpacity={0.9}
                            onPress={() =>
                            {
                                if (selectedAddress)
                                    onProceed(selectedAddress);
                            }}
                            disabled={!selectedAddress || isProcessing}>
                            <View
                                className="flex-row items-center justify-center">
                                {isProcessing ? (
                                    <ActivityIndicator size="small" color={"#121212"} />
                                ) : (
                                    <>
                                        <Text
                                            className="text-background font-bold text-lg mr-2">
                                            Continue to payment
                                        </Text>
                                        <Ionicons name="arrow-forward" size={20} color={"#121212"} />
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}