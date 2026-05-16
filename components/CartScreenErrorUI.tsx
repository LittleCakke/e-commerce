import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreenErrorUI()
{
    return (
        <View
            className="flex-1 bg-background items-center justify-center px-6">
            <Ionicons name="alert-circle-outline" size={64} color={"#FF6B6B"} />
            <Text
                className="text-text-primary font-semibold text-xl mt-4">
                Failed to load cart data
            </Text>
            <Text
                className="text-text-secondary text-center mt-2">
                Please check your connection and try again
            </Text>
        </View>
    );
}