import { ActivityIndicator, Text, View } from "react-native";

export default function CartScreenLoadingUI()
{
    return (
        <View
            className="flex-1 bg-background items-center justify-center">
            <ActivityIndicator size="large" color={"#00D9FF"} />
            <Text
                className="text-text-secondary mt-4">
                Loading cart data...
            </Text>
        </View>
    );
}