import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate, capitalizeFirstLetter, getStatusColor } from "@/lib/utils";
import type { Order, OrderItem } from "@/type";

export default function OrderItem({ order, onOpen }: { order: Order, onOpen: (order: Order) => void })
{
    let totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    let firstImage = order.orderItems[0].image || "";

    const OrderReview = () =>
    {
        if (order.status === "delivered")
        {
            if (order.hasReviewed)
                return (
                    <View
                        className="bg-primary/20 px-5 py-3 rounded-full flex-row items-center">
                        <Ionicons name="checkmark-circle" size={18} color={"#1DB954"}/>
                        <Text
                            className="text-primary font-bold text-sm ml-2">
                            Reviewed
                        </Text>
                    </View>
                );
            else
                return (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onOpen(order)}
                        className="bg-primary px-5 py-3 rounded-full flex-row items-center">
                        <Ionicons name="star" size={18} color={"#121212"} />
                        <Text
                            className="text-background font-bold text-sm ml-2">
                            Leave Rating
                        </Text>
                    </TouchableOpacity>
                );
        }
        return null;
    }

    const OrderItemSummary = ({ item }: { item: OrderItem }) =>
    {
        return (
            <Text
                key={item._id}
                className="text-text-secondary text-sm flex-1">
                {item.name} x {item.quantity}
            </Text>
        );
    }

    return (
        <View
            className="bg-surface rounded-3xl p-5">
            <View
                className="flex-row mb-4">
                <View
                    className="relative">
                    <Image
                        source={{ uri: firstImage }}
                        className="size-20 rounded-lg"
                        resizeMode="cover"
                    />

                    {/* Badge for more items */}
                    {order.orderItems.length > 1 && (
                        <View
                            className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center">
                            <Text
                                className="text-background text-xs font-bold">
                                +{order.orderItems.length - 1}
                            </Text>
                        </View>
                    )}
                </View>

                <View
                    className="flex-1 ml-4">
                    <Text
                        className="text-white font-bold text-base mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </Text>
                    <Text
                        className="text-text-secondary text-sm mb-2">
                        {formatDate(order.createdAt)}
                    </Text>
                    <View
                        style={{ backgroundColor: getStatusColor(order.status) + "20" }}
                        className="self-start px-3 py-1.5 rounded-full">
                        <Text
                            className="text-xs font-bold"
                            style={{ color: getStatusColor(order.status) }}>
                            {capitalizeFirstLetter(order.status)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Order Items Summary */}
            {order.orderItems.map(item => <OrderItemSummary key={item._id} item={item} /> )}

            <View
                className="border-t border-background-lighter pt-3 flex-row justify-between items-center">
                <View
                    className="gap-1">
                    <Text
                        className="text-text-secondary text-xs">
                        {totalItems} items
                    </Text>
                    <Text
                        className="text-primary font-bold text-xl">
                        ${order.totalPrice.toFixed(2)}
                    </Text>
                </View>

                <OrderReview />
            </View>
        </View>
    );
}