import SafeScreen from "@/components/SafeScreen";
import { ActivityIndicator, Text, View } from "react-native";

export default function ProductDetailLoadingUI()
{
    return (
        <SafeScreen>
            <View
                className="flex-1 items-center justify-center gap-4">
                <ActivityIndicator size="large" color={"#1DB954"} />
                <Text
                    className="text-text-secondary">
                    Loading product's details...
                </Text>
            </View>
        </SafeScreen>
    );
}