import { View, Text } from "react-native";
import "@/global.css";
import { Ionicons } from "@expo/vector-icons";

export default function Page()
{
    return (
        <View
            className="flex-1 items-center justify-center gap-2 bg-background">
            <Ionicons name="help-outline" size={50} color="#666666" />
            <Text
                className="text-white text-2xl font-semibold">
                Pages Not Found
            </Text>
        </View>
    );
}