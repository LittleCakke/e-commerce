import { View, Text } from "react-native";
import PrivacySecurityCardItem from "@/components/PrivacySecurityCardItem";
import type { PrivacySecurityItem } from "@/type";

export default function PrivacySecurityCard({ card, handleToggle }: { card: PrivacySecurityItem, handleToggle: (id: string, value: boolean) => void })
{
    return (
        <View
            className="px-6 pt-6">
            <Text
                className="text-text-primary text-lg font-bold mb-4">
                { card.title }
            </Text>
            {card.items.map(setting => <PrivacySecurityCardItem handleToggle={handleToggle} item={setting} key={setting.id} />)}
        </View>
    );
}