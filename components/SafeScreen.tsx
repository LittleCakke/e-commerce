import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeScreen({ children }: { children?: React.ReactNode })
{
    let insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top }}
            className="flex-1 bg-background">
            { children }
        </View>
    );
}