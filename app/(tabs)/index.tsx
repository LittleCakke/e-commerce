import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import useProduct from "@/hooks/useProduct";
import ProductsGrid from "@/components/ProductsGrid";

const CATEGORIES = [
    {
        name: "All",
        icon: "grid-outline" as const
    },
    {
        name: "Electronics",
        image: require("@/assets/images/electronics.png")
    },
    {
        name: "Fashion",
        image: require("@/assets/images/fashion.png")
    },
    {
        name: "Sports",
        image: require("@/assets/images/sports.png")
    },
    {
        name: "Books",
        image: require("@/assets/images/books.png")
    }
];

export default function Page()
{
    let { data: products = [], isLoading, isError } = useProduct();

    let [ searchQuery, setSearchQuery ] = useState("");
    let [ selectedCategory, setSelectedCategory ] = useState("All");

    let filteredProducts = useMemo(() =>
    {
        if (!products) return [];

        let filtered = products;

        // filtering by category
        if (selectedCategory !== "All")
            filtered = filtered.filter(product => product.category === selectedCategory);

        // filtering by search query
        if (searchQuery.trim())
            filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return filtered;
    }, [products, selectedCategory, searchQuery]);

    return (
        <SafeScreen>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{paddingBottom: 100}}
                showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View
                    className="px-6 pb-4 pt-6">
                    <View
                        className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text
                                className="text-text-primary text-3xl font-bold tracking-tight">
                                Shop
                            </Text>
                            <Text
                                className="text-text-secondary text-sm mt-1">
                                Browse all products
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="bg-surface/50 p-3 rounded-full">
                            <Ionicons name="options-outline" size={22} color={"#FFF"} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View
                        className="bg-surface flex-row items-center px-5 py-2 rounded-2xl">
                        <Ionicons name="search" color="#666" size={22} />
                        <TextInput
                            placeholder="Search for products"
                            placeholderTextColor="#666"
                            className="flex-1 ml-3 text-base text-text-primary"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Category Filter */}
                <View
                    className="mb-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingHorizontal: 20}}>
                        {CATEGORIES.map(category => (
                            <TouchableOpacity
                                key={category.name}
                                onPress={() => setSelectedCategory(category.name)}
                                className={[
                                    "mr-3",
                                    "size-20",
                                    "rounded-2xl",
                                    "overflow-hidden",
                                    "items-center",
                                    "justify-center",
                                    selectedCategory === category.name ? "bg-primary" : "bg-surface"
                                ].join(" ")}>
                                {category.icon ? (
                                    <Ionicons name={category.icon} size={36} color={selectedCategory === category.name ? "#121212" : "#FFFFFF"} />
                                ) : (
                                    <Image source={category.image} className="size-12" resizeMode="contain" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View
                    className="px-6 mb-6">
                    <View
                        className="flex-row items-center justify-between mb-4">
                        <Text
                            className="text-text-primary text-lg font-bold">
                            Products
                        </Text>
                        <Text
                            className="text-text-secondary text-sm font-bold">
                            {filteredProducts.length} item(s)
                        </Text>
                    </View>

                    {/* Products Grid */}
                    <ProductsGrid
                        products={filteredProducts}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </View>
            </ScrollView>
        </SafeScreen>
    );
}