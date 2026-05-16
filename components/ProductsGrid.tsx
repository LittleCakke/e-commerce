import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import NoProductsFound from "@/components/NoProductsFound";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import type { Product } from "@/type";

interface ProductsGridProps
{
    products: Product[];
    isLoading: boolean;
    isError: boolean;
}

export default function ProductsGrid({ products, isLoading, isError }: ProductsGridProps)
{
    let {
        isInWishlist,
        toggleWishlist,
        isAddingToWishlist,
        isRemovingFromWishlist
    } = useWishlist();

    let { addToCart, isAddingToCart } = useCart();

    const handleAddToCart = (productId: string, productName: string) =>
    {
        addToCart({ productId, quantity: 1 }, {
            onSuccess: () => Alert.alert("Success", `${productName} added to cart`),
            onError: (e: any) => Alert.alert("Error", e?.response?.data?.error || "Failed to add to cart"),
        });
    }

    function ProductItem({ item }: { item: Product })
    {
        return (
            <TouchableOpacity
                // @ts-ignore todo
                onPress={() => router.push(`/product/${item._id}`)}
                style={{ width: "48%" }}
                activeOpacity={0.8}
                className="bg-surface rounded-3xl overflow-hidden mb-3">
                <View
                    className="relative">
                    <Image
                        source={{ uri: item.images[0] }}
                        className="w-full h-44 bg-background-lighter"
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
                        activeOpacity={0.7}
                        onPress={() => toggleWishlist(item._id)}
                        disabled={isAddingToWishlist || isRemovingFromWishlist}>
                        {isAddingToWishlist || isRemovingFromWishlist ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons
                                name={isInWishlist(item._id) ? "heart" : "heart-outline"}
                                size={18}
                                color={isInWishlist(item._id) ? "#FF6B6B" : "#FFFFFF"}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View
                    className="p-3">
                    <Text
                        className="text-text-secondary text-xs mb-1">
                        {item.category}
                    </Text>
                    <Text
                        numberOfLines={2}
                        className="text-text-primary font-bold text-sm mb-2">
                        {item.name}
                    </Text>

                    <View
                        className="flex-row items-center mb-2">
                        <Ionicons name="star" size={12} color="#FFC107" />
                        <Text
                            className="text-text-primary text-xs font-semibold ml-1">
                            {item.averageRating.toFixed(1)}
                        </Text>
                        <Text
                            className="text-text-secondary text-xs ml-1">
                            ({item.totalReviews})
                        </Text>
                    </View>

                    <View
                        className="flex-row items-center justify-between">
                        <Text
                            className="text-primary font-bold text-lg">
                            ${item.price.toFixed(2)}
                        </Text>

                        <TouchableOpacity
                            className="bg-primary rounded-full size-8 items-center justify-center"
                            activeOpacity={0.7}
                            onPress={() => handleAddToCart(item._id, item.name)}
                            disabled={isAddingToCart}>
                            {isAddingToCart ? (
                                <ActivityIndicator size="small" color="#121212" />
                            ) : (
                                <Ionicons name="add" size={18} color="#121212" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    if (isLoading) return (
        <View
            className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#00D9FF" />
            <Text
                className="text-text-secondary mt-4">
                Loading products...
            </Text>
        </View>
    );

    if (isError) return (
        <View
            className="py-20 items-center justify-center">
            <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
            <Text
                className="text-text-primary font-semibold mt-4">
                Failed to load products
            </Text>
            <Text
                className="text-text-secondary text-sm mt-2">
                Please try again later
            </Text>
        </View>
    );

    return (
        <FlatList
            data={products}
            renderItem={ProductItem}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={NoProductsFound}
        />
    );
}