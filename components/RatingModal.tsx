import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { OrderItem, RatingModalProps } from "@/type";

export default function RatingModal({
    visible,
    order,
    productRatings,
    isSubmitting,
    onClose,
    onRatingChange,
    onSubmit
}: RatingModalProps)
{
    const OrderItemRating = ({ item, index }: { item: OrderItem, index: number }) =>
    {
        let productId = item.product._id;
        let currentRating = productRatings[productId] || 0;

        return (
            <View
                className="bg-background-lighter rounded-2xl p-4">
                <View
                    className="flex-row items-center mb-3">
                    <Image
                        source={{ uri: item.image }}
                        className="size-16 rounded-lg"
                    />
                    <View
                        className="flex-1 ml-3">
                        <Text
                            numberOfLines={2}
                            className="text-white font-semibold text-sm">
                            {item.name}
                        </Text>
                        <Text
                            className="text-text-secondary text-xs mt-1">
                            Qty: {item.quantity} x ${item.price.toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View
                    className="flex-row justify-center gap-x-3">
                    {[1, 2, 3, 4, 5].map(star => (
                        <TouchableOpacity
                            onPress={() => onRatingChange(productId, star)}
                            activeOpacity={0.7}
                            key={star}>
                            <Ionicons
                                name={star <= currentRating ? "star" : "star-outline"}
                                size={32}
                                color={star <= currentRating ? "#1DB954" : "#666666"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        )
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
            visible={visible}>
            <TouchableWithoutFeedback
                onPress={onClose}>
                <View
                    className="flex-1 bg-black opacity-70 items-center justify-center px-4">
                    <TouchableWithoutFeedback>
                        <View
                            className="bg-surface rounded-3xl p-6 w-full max-w-md max-h-4/5">
                            <View
                                className="items-center mb-4">
                                <View
                                    className="bg-primary/20 rounded-full size-16 items-center justify-center mb-3">
                                    <Ionicons name="star" size={32} color={"#1DB954"} />
                                </View>
                                <Text
                                    className="text-white text-2xl font-bold mb-1">
                                    Rate Your Products
                                </Text>
                                <Text
                                    className="text-text-secondary text-center text-sm">
                                    Rate each product from your order
                                </Text>
                            </View>

                            <ScrollView
                                className="mb-4 gap-y-3">
                                {order?.orderItems.map((item, index) => <OrderItemRating key={item._id} item={item} index={index} />)}
                            </ScrollView>

                            <View
                                className="gap-3">
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={onSubmit}
                                    disabled={isSubmitting}
                                    className="bg-primary rounded-2xl py-4 items-center">
                                    {isSubmitting ? (
                                        <ActivityIndicator size="small" color={"#121212"} />
                                    ) : (
                                        <Text
                                            className="text-background font-bold text-base">
                                            Submit All Ratings
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-surface-light rounded-2xl py-4 items-center border border-background-lighter"
                                    activeOpacity={0.7}
                                    onPress={onClose}
                                    disabled={isSubmitting}>
                                    <Text
                                        className="text-text-secondary font-bold text-base">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}