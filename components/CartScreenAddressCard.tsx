import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CartScreenAddressCardProps } from "@/type";

export default function CartScreenAddressCard({
    address,
    selectedAddressId,
    setSelectedAddress
}: CartScreenAddressCardProps)
{
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedAddress(address)}
            className={[
                "bg-surface",
                "rounded-3xl",
                "p-6",
                "border-2",
                selectedAddressId === address._id ? "border-primary" : "border-background-lighter"
            ].join(" ")}>
            <View
                className="flex-row items-start justify-between">
                <View
                    className="flex-1">
                    <View
                        className="flex-row items-center mb-3">
                        <Text
                            className="text-primary font-bold text-lg mr-2">
                            {address.label}
                        </Text>
                        {address.isDefault && (
                            <View
                                className="bg-primary/20 rounded-full px-3 py-1">
                                <Text
                                    className="text-primary text-sm font-semibold">
                                    Default
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text
                        className="text-white font-semibold text-lg mb-2">
                        {address.fullName}
                    </Text>
                    <Text
                        className="text-text-secondary text-base leading-6 mb-1">
                        {address.streetAddress}
                    </Text>
                    <Text
                        className="text-text-secondary text-base mb-2">
                        {address.city}, {address.state} {address.zipCode}
                    </Text>
                    <Text
                        className="text-text-secondary text-base">
                        {address.phoneNumber}
                    </Text>
                </View>
                {selectedAddressId === address._id && (
                    <View
                        className="bg-primary rounded-full p-2 ml-3">
                        <Ionicons name="checkmark" size={24} color={"#121212"} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}