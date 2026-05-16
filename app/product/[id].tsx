import { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useCart from "@/hooks/useCart";
import useProductItem from "@/hooks/useProductItem";
import useWishlist from "@/hooks/useWishlist";
import ProductDetailErrorUI from "@/components/ProductDetailErrorUI";
import ProductDetailLoadingUI from "@/components/ProductDetailLoadingUI";
import SafeScreen from "@/components/SafeScreen";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function ProductDetailPage()
{
    let { id } = useLocalSearchParams<{ id: string }>();
    let { data: product, isError, isLoading } = useProductItem(id);
    let { addToCart, isAddingToCart } = useCart();
    let { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } = useWishlist();

    let [selectedImageIndex, setSelectedImageIndex] = useState(0);
    let [quantity, setQuantity] = useState(1);

    const handleAddToCart = () =>
    {
        if (!product) return;

        addToCart({ productId: product._id, quantity }, {
            onSuccess: () => Alert.alert("Success", `"${product.name}" added to cart!`),
            onError: (e: any) => Alert.alert("Error", e?.response?.data?.error || "Failed to add to cart"),
        });
    }

    if (isLoading) return <ProductDetailLoadingUI />;

    if (isError || !product) return <ProductDetailErrorUI />;

    let inStock = product.stock > 0;

    return (
        <SafeScreen>
            {/* region Header */}
            <View
                className="absolute top-0 left-0 right-0 z-10 px-6 pt-20 pb-4 flex-row items-center justify-between">
                <TouchableOpacity
                    className="bg-white/30 backdrop-blur-xl size-12 rounded-full items-center justify-center"
                    onPress={() => router.back()}
                    activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={"#121212"} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => toggleWishlist(product._id)}
                    activeOpacity={0.7}
                    disabled={isAddingToWishlist || isRemovingFromWishlist}
                    className={[
                        "size-12",
                        "rounded-full",
                        "items-center",
                        "justify-center",
                        isInWishlist(product._id) ? "bg-red-500/20" : "bg-white/30 backdrop-blur-xl"
                    ].join(" ")}>
                    {isAddingToWishlist || isRemovingFromWishlist ? (
                        <ActivityIndicator size="small" color={"#FFFFFF"} />
                    ) : (
                        <Ionicons
                            name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                            size={24}
                            color={isInWishlist(product._id) ? "#FB2C36" : "#121212"}
                        />
                    )}
                </TouchableOpacity>
            </View>
            {/* endregion */}

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 75 }}
                showsVerticalScrollIndicator={false}>
                {/* region Image Gallery */}
                <View
                    className="relative">
                    <ScrollView
                        horizontal
                        pagingEnabled
                        onScroll={e =>
                        {
                            let index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setSelectedImageIndex(index);
                        }}
                        showsHorizontalScrollIndicator={false}>
                        {product.images.map((image: string, index)=> (
                            <View
                                key={index}
                                style={{ width }}>
                                <Image
                                    source={image}
                                    style={{ width, height: 400 }}
                                    contentFit="cover"
                                />
                            </View>
                        ))}
                    </ScrollView>

                    {/* region Image Indicators */}
                    <View
                        className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                        {product.images.map((_, index) => (
                            <View
                                key={index}
                                className={[
                                    "h-2",
                                    "rounded-full",
                                    index === selectedImageIndex ? "bg-primary w-6" : "bg-white/50 w-2"
                                ].join(" ")}
                            />
                        ))}
                    </View>
                    {/* endregion */}
                </View>
                {/* endregion */}

                {/* Product Info */}
                <View
                    className="p-6 gap-3">
                    {/* region Category */}
                    <View
                        className="flex-row items-center">
                        <View
                            className="bg-primary/20 px-3 py-1 rounded-full">
                            <Text
                                className="text-primary text-xs font-bold">
                                {product.category}
                            </Text>
                        </View>
                    </View>
                    {/* endregion */}

                    {/* region Product Name */}
                    <Text
                        className="text-white text-3xl font-bold">
                        {product.name}
                    </Text>
                    {/* endregion */}

                    {/* region Rating & Reviews */}
                    <View
                        className="flex-row items-center">
                        <View
                            className="flex-row items-center bg-surface px-3 py-2 rounded-full">
                            <Ionicons name="star" size={16} color={"#FFC107"} />
                            <Text
                                className="text-white font-bold ml-1 mr-2">
                                {product.averageRating.toFixed(1)}
                            </Text>
                            <Text
                                className="text-text-secondary text-sm">
                                ({product.totalReviews} reviews)
                            </Text>
                        </View>
                        {inStock ? (
                            <View
                                className="ml-3 flex-row items-center">
                                <View
                                    className="size-2 bg-green-500 rounded-full mr-2"
                                />
                                <Text
                                    className="text-green-500 font-semibold text-sm">
                                    {product.stock} in stock
                                </Text>
                            </View>
                        ) : (
                            <View
                                className="ml-3 flex-row items-center">
                                <View
                                    className="size-2 bg-red-500 rounded-full mr-2"
                                />
                                <Text
                                    className="text-red-500 font-semibold text-sm">
                                    Out of Stock
                                </Text>
                            </View>
                        )}
                    </View>
                    {/* endregion */}

                    {/* region Price */}
                    <View
                        className="flex-row items-center mb-3">
                        <Text
                            className="text-primary text-4xl font-bold">
                            ${product.price.toFixed(2)}
                        </Text>
                    </View>
                    {/* endregion */}

                    {/* region Quantity */}
                    <View
                        className="mb-3">
                        <Text
                            className="text-white text-lg font-bold mb-3">
                            Quantity
                        </Text>
                        <View
                            className="flex-row items-center gap-6">
                            <TouchableOpacity
                                className="bg-surface rounded-full size-12 items-center justify-center"
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                activeOpacity={0.7}
                                disabled={!inStock}>
                                <Ionicons name="remove" size={24} color={inStock ? "#FFFFFF" : "#666666"} />
                            </TouchableOpacity>

                            <Text
                                className="text-white text-xl font-bold">
                                {quantity}
                            </Text>

                            <TouchableOpacity
                                className="bg-primary rounded-full size-12 items-center justify-center"
                                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                activeOpacity={0.7}
                                disabled={!inStock || quantity >= product.stock}>
                                <Ionicons
                                    name="add"
                                    size={24}
                                    color={!inStock || quantity >= product.stock ? "#666666" : "#121212"}
                                />
                            </TouchableOpacity>
                        </View>
                        {quantity >= product.stock && inStock && (
                            <Text
                                className="text-orange-500 text-sm mt-2">
                                Maximum stock reached
                            </Text>
                        )}
                    </View>
                    {/* endregion */}

                    {/* region Description */}
                    <View
                        className="mb-8">
                        <Text
                            className="text-white text-lg font-bold mb-3">
                            Description
                        </Text>
                        <Text
                            className="text-text-secondary text-base leading-6">
                            {product.description}
                        </Text>
                    </View>
                    {/* endregion */}
                </View>
            </ScrollView>

            {/* region Bottom Action Bar */}
            <View
                className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-surface px-6 py-4 pb-8">
                <View
                    className="flex-row items-center gap-3">
                    <View
                        className="flex-1">
                        <Text
                            className="text-text-secondary text-sm mb-1">
                            Total Price
                        </Text>
                        <Text
                            className="text-primary text-2xl font-bold">
                            ${(product.price * quantity).toFixed(2)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleAddToCart}
                        disabled={!inStock || isAddingToCart}
                        className={[
                            "rounded-2xl",
                            "px-8",
                            "py-4",
                            "flex-row",
                            "items-center",
                            "gap-2",
                            !inStock ? "bg-surface" : "bg-primary"
                        ].join(" ")}>
                        {isAddingToCart ? (
                            <ActivityIndicator size="small" color={"#121212"} />
                        ): (
                            <>
                                <Ionicons name="cart" size={24} color={!inStock ? "#666666" : "#121212"} />
                                <Text
                                    className={[
                                        "font-bold",
                                        "text-lg",
                                        !inStock ? "text-text-secondary" : "text-background"
                                    ].join(" ")}>
                                    {!inStock ? "Out of Stock" : "Add to Cart"}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {/* endregion */}
        </SafeScreen>
    );
}