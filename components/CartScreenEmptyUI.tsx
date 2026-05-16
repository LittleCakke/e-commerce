import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreenEmptyUI()
{
    return (
        <View
            className="flex-1 bg-background">
            <View
                className="px-6 pt-16 pb-5">
                <Text
                    className="text-white text-3xl font-bold tracking-tight">
                    Cart
                </Text>
            </View>
            <View
                className="flex-1 items-center justify-center px-6">
                <Ionicons name="cart-outline" size={80} color={"#666666"} />
                <Text
                    className="text-white font-semibold text-xl mt-4">
                    Your cart is empty
                </Text>
                <Text
                    className="text-text-secondary text-center mt-2">
                    Add some products to get started
                </Text>
            </View>
        </View>
    );
}