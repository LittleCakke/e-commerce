import { Text, TouchableOpacity, View } from "react-native";
import type { AddressCardProps } from "@/type";
import { Ionicons } from "@expo/vector-icons";

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    isDeletingAddress,
    isUpdatingAddress
}: AddressCardProps)
{
    return (
        <View
            className="bg-surface rounded-3xl p-5 mb-3 gap-4">
            <View
                className="flex-row items-center justify-between">
                <View
                    className="flex-row items-center gap-3">
                    <View
                        className="bg-primary/20 rounded-full size-12 items-center justify-center">
                        <Ionicons name="location" size={24} color={"#1DB954"} />
                    </View>
                    <Text
                        className="text-white font-bold text-lg">
                        {address.label}
                    </Text>
                </View>
                {address.isDefault && (
                    <View
                        className="bg-primary px-3 py-1 rounded-full">
                        <Text
                            className="text-background text-xs font-bold italic">
                            Default
                        </Text>
                    </View>
                )}
            </View>
            <View
                className="gap-1">
                <Text
                    className="text-white font-semibold">
                    {address.fullName}
                </Text>
                <Text
                    className="text-text-secondary text-sm">
                    {address.streetAddress}
                </Text>
                <Text
                    className="text-text-secondary text-sm mb-1">
                    {address.city}, {address.state} {address.zipCode}
                </Text>
                <Text
                    className="text-text-secondary text-sm">
                    {address.phoneNumber}
                </Text>
            </View>
            <View
                className="flex-row gap-2">
                <TouchableOpacity
                    className="flex-1 bg-primary/20 py-3 rounded-xl items-center"
                    activeOpacity={0.7}
                    onPress={() => onEdit(address)}
                    disabled={isUpdatingAddress}>
                    <Text
                        className="text-primary font-bold">
                        Edit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 bg-red-500/20 py-3 rounded-xl items-center"
                    activeOpacity={0.7}
                    onPress={() => onDelete(address._id, address.label)}
                    disabled={isDeletingAddress}>
                    <Text
                        className="text-red-500 font-bold">
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}