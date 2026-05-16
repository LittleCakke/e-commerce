import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NoProductsFound()
{
    return (
        <View
            className="py-20 items-center justify-center">
            <Ionicons
                name="search-outline"
                size={48}
                color="#666"
            />
            <Text
                className="text-text-primary font-semibold mt-4">
                No products found
            </Text>
            <Text
                className="text-text-secondary text-sm mt-2">
                Try adjusting your filters
            </Text>
        </View>
    );
}