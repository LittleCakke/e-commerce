import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";

export default function EmptyOrderScreen()
{
    return (
        <SafeScreen>
            <ScreenHeader title="Order" />

            <View
                className="flex-1 items-center justify-center px-6">
                <Ionicons name="receipt-outline" size={80} color={"#666"} />
                <Text
                    className="text-white font-semibold text-xl mt-4">
                    No orders yet
                </Text>
                <Text
                    className="text-text-secondary text-center mt-2">
                    Your order history will appear here
                </Text>
            </View>
        </SafeScreen>
    );
}