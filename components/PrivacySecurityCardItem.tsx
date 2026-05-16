import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SecurityOption } from "@/type";

export default function PrivacySecurityCardItem({ item, handleToggle }: { item: SecurityOption, handleToggle: (id: string, value: boolean) => void })
{
    return (
        <TouchableOpacity
            key={item.id}
            activeOpacity={item.type === "toggle" ? 1 : 0.7}
            className="bg-surface rounded-2xl p-4 mb-3">
            <View
                className="flex-row items-center">
                <View
                    className="bg-primary/20 rounded-full size-12 items-center justify-center mr-4">
                    <Ionicons name={item.icon as any} size={24} color="#1DB954" />
                </View>

                <View
                    className="flex-1">
                    <Text
                        className="text-text-primary font-bold text-base mb-1">
                        {item.title}
                    </Text>
                    <Text
                        className="text-text-secondary text-sm">
                        {item.description}
                    </Text>
                </View>

                {item.type === "toggle" ? (
                    <Switch
                        value={item.value}
                        onValueChange={value => handleToggle(item.id, value)}
                        thumbColor="#FFFFFF"
                        trackColor={{
                            false: "#2A2A2A",
                            true: "#1DB954"
                        }}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                )}

            </View>
        </TouchableOpacity>
    );
}