import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";
import useWishlist from "@/hooks/useWishlist";
import LoadingUI from "@/components/LoadingUI";
import ErrorUI from "@/components/ErrorUI";
import WishlistItem from "@/components/WishlistItem";

export default function Page()
{
    let {
        wishlist,
        isLoading,
        isError
    } = useWishlist();

    if (isLoading) return <LoadingUI title="Wishlist" />;

    if (isError) return <ErrorUI title="Wishlist" />;

    return (
        <SafeScreen>
            {/* region Header */}
            <View
                className="px-6 pb-5 border-b border-surface flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4">
                    <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text
                    className="text-text-primary text-2xl font-bold">
                    Wishlist
                </Text>
                <Text
                    className="text-text-secondary text-sm ml-auto">
                    {wishlist.length} item(s)
                </Text>
            </View>
            {/* endregion */}

            {wishlist.length === 0 ? (
                <View
                    className="flex-1 items-center justify-center px-6">
                    <Ionicons name="heart-outline" size={80} color="#666666" />
                    <Text
                        className="text-text-primary font-semibold text-xl mt-4">
                        Your wishlist is empty
                    </Text>
                    <Text
                        className="text-text-secondary text-center mt-2">
                        Start adding products you love!
                    </Text>
                    <TouchableOpacity
                        className="bg-primary rounded-2xl px-8 py-4 mt-6"
                        activeOpacity={0.8}
                        onPress={() => router.push("//(tabs)")}>
                        <Text
                            className="text-background font-bold text-base">
                            Browse Products
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
                        {wishlist.map(item => <WishlistItem product={item} key={item._id} /> )}
                    </View>
                </ScrollView>
            )}
        </SafeScreen>
    );
}