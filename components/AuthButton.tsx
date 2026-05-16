import { ActivityIndicator, Image, TouchableOpacity, Text, View } from "react-native";
import useSocialAuth from "@/hooks/useSocialAuth";
import type { Strategy } from "@/type";

export default function AuthButton({ strategy, source }: { strategy: Strategy, source: any })
{
    let { isLoading, handleSocialAuth } = useSocialAuth();

    const text = () =>
    {
        let t = strategy.split("_")[1];
        return t.charAt(0).toUpperCase() + t.slice(1);
    }

    return (
        <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3"
            onPress={() => handleSocialAuth(strategy)}
            disabled={isLoading}
            style={{
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.1,
                elevation: 2 // this is for andriod
            }}>
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color="#4285F4"
                />
            ) : (
                <View
                    className="flex-row items-center justify-center gap-3">
                    <Image
                        source={source}
                        className="size-10"
                        resizeMode="contain"
                    />
                    <Text
                        className="text-black font-medium text-base">
                        Continue with {text()}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}