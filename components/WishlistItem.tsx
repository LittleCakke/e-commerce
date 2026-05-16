import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import type { Product } from "@/type";

export default function WishlistItem({ product }: { product: Product })
{
    let {
        removeFromWishlist,
        isRemovingFromWishlist
    } = useWishlist();

    let {
        addToCart,
        isAddingToCart
    } = useCart();

    const handleRemoveFromWishlist = (productId: string, productName: string) =>
    {
        Alert.alert("Remove from wishlist", `Remove ${productName} from wishlist`, [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => removeFromWishlist(productId)
            }
        ]);
    }

    const handleAddToCart = (productId: string, productName: string) =>
    {
        addToCart({ productId, quantity: 1 }, {
            onSuccess: () => Alert.alert("Success", `${productName} added to cart!`),
            onError: (e: any) =>
            {
                Alert.alert("Error", e?.response?.data?.error || "Failed to add to cart");
            }
        });
    }

    return (
        <TouchableOpacity
            key={product._id}
            activeOpacity={0.8}
            // @ts-ignore
            onPress={() => router.push(`/product/${product._id}`)}
            className="bg-surface rounded-3xl overflow-hidden mb-3">
            <View
                className="flex-row p-4">
                <Image
                    source={{ uri: product.images[0] }}
                    className="rounded-2xl bg-background-lighter"
                    resizeMode="cover"
                    style={{ width: 96, height: 96 }}
                />

                <View
                    className="flex-1 ml-4">
                    <Text
                        numberOfLines={2}
                        className="text-text-primary font-bold text-base mb-2">
                        {product.name}
                    </Text>
                    <Text
                        className="text-primary font-bold text-xl mb-2">
                        ${product.price.toFixed(2)}
                    </Text>

                    {product.stock > 0 ? (
                        <View
                            className="flex-row items-center">
                            <View
                                className="size-2 bg-green-500 rounded-full mr-2"
                            />
                            <Text
                                className="text-green-500 text-sm font-semibold">
                                {product.stock} in stock
                            </Text>
                        </View>
                    ) : (
                        <View
                            className="flex-row items-center">
                            <View
                                className="size-2 bg-red-500 rounded-full mr-2"
                            />
                            <Text
                                className="text-red-500 text-sm font-semibold">
                                Out of stock
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    className="self-start bg-red-500/20 p-2 rounded-full"
                    activeOpacity={0.7}
                    onPress={() => handleRemoveFromWishlist(product._id, product.name)}
                    disabled={isRemovingFromWishlist}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
            {product.stock > 0 && (
                <View
                    className="px-4 pb-4">
                    <TouchableOpacity
                        className="bg-primary rounded-xl py-3 items-center"
                        activeOpacity={0.8}
                        onPress={() => handleAddToCart(product._id, product.name)}
                        disabled={isAddingToCart}>
                        {isAddingToCart ? (
                            <ActivityIndicator size="small" color="#121212" />
                        ) : (
                            <Text
                                className="text-background font-bold">
                                Add to Cart
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
}