import SafeScreen from "@/components/SafeScreen";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProductDetailErrorUI()
{
    return (
        <SafeScreen>
            <View
                className="flex-1 items-center justify-center px-6 gap-2">
                <Ionicons name="alert-circle-outline" size={64} color={"#FF6B6B"} />
                <Text
                    className="text-white font-semibold text-xl mt-2">
                    Product not found
                </Text>
                <Text
                    className="text-text-secondary text-center">
                    This product may have been removed or doesn&apos;t exist
                </Text>
                <TouchableOpacity
                    className="bg-primary rounded-2xl px-6 py-3 mt-4"
                    onPress={() => router.back()}>
                    <Text
                        className="text-background font-bold">
                        Go Back
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeScreen>
    );
}