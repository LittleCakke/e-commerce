import { Image, View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import useCart from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import type { CartItem } from "@/type";

export default function CartItem({ item }: { item: CartItem })
{
    // region states and data
    let {
        cartTotal,
        isRemoving,
        isUpdating,
        removeFromCart,
        updateQuantity,
    } = useCart();

    let subtotal = cartTotal;
    // endregion

    // region methods
    const handleQuantityChange = (productId: string, currentQuantity: number, change: number) =>
    {
        let newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        updateQuantity({ productId, quantity: newQuantity });
    }

    const handleRemoveItem = (productId: string, productName: string)=>
    {
        Alert.alert("Remove Item", `Remove "${productName}" from cart?`, [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => removeFromCart(productId)
            }
        ]);
    }
    // endregion
    
    return (
        <View
            className="bg-surface rounded-3xl overflow-hidden">
            <View
                className="p-4 flex-row">
                {/* Product Image */}
                <View
                    className="relative">
                    <Image
                        source={{ uri: item.product.images[0] }}
                        className="size-28 rounded-2xl bg-background-lighter"
                        resizeMode="cover"
                    />
                    <View
                        className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                        <Text
                            className="text-background text-xs font-bold">
                            x{item.quantity}
                        </Text>
                    </View>
                </View>

                <View
                    className="flex-1 ml-4 justify-between">
                    <View>
                        <Text
                            numberOfLines={2}
                            className="text-white font-bold text-lg leading-tight">
                            {item.product.name}
                        </Text>
                        <View
                            className="flex-row items-center mt-2">
                            <Text
                                className="text-primary font-bold text-2xl">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </Text>
                            <Text
                                className="text-text-secondary text-sm ml-2">
                                ${item.product.price.toFixed(2)} each
                            </Text>
                        </View>
                    </View>

                    <View
                        className="flex-row items-center mt-3 gap-x-4">
                        <TouchableOpacity
                            className="bg-background-lighter rounded-full size-9 items-center justify-center"
                            activeOpacity={0.7}
                            onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                            disabled={isUpdating}>
                            {isUpdating ? (
                                <ActivityIndicator size="small" color={"#FFFFFF"} />
                            ) : (
                                <Ionicons name="remove" size={18} color={"#FFFFFF"} />
                            )}
                        </TouchableOpacity>

                        <View
                            className="min-w-8 items-center">
                            <Text
                                className="text-text-primary font-bold text-lg">
                                {item.quantity}
                            </Text>
                        </View>

                        <TouchableOpacity
                            className="bg-primary rounded-full size-9 items-center justify-center"
                            activeOpacity={0.7}
                            onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                            disabled={isUpdating}>
                            {isUpdating ? (
                                <ActivityIndicator size="small" color={"#121212"} />
                            ) : (
                                <Ionicons name="add" size={18} color={"#121212"} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="ml-auto bg-red-500/20 rounded-full size-9 items-center justify-center"
                            activeOpacity={0.7}
                            onPress={() => handleRemoveItem(item.product._id, item.product.name)}
                            disabled={isRemoving}>
                            <Ionicons name="trash-outline" size={18} color={"#EF4444"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}