import { View, Text, ActivityIndicator } from "react-native";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";

export default function LoadingUI({ title }: { title: string })
{
    return (
        <SafeScreen>
            <ScreenHeader title={title} />
            <View
                className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#1DB954" />
                <Text
                    className="text-text-secondary mt-4">
                    Loading {title.toLowerCase()}...
                </Text>
            </View>
        </SafeScreen>
    );
}