import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ScreenHeader({ title }: { title: string })
{
    return (
        <View
            className="px-6 pb-5 border-b border-surface flex-row items-center">
            <TouchableOpacity
                onPress={() => router.back()}
                className="mr-4">
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text
                className="text-white text-2xl font-bold">
                {title}
            </Text>
        </View>
    );
}