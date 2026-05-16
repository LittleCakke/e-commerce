import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useAuth, useUser } from "@clerk/expo";
import { router } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";

const MENU_ITEMS = [
    {
        id: 1,
        icon: "person-outline",
        title: "Edit Profile",
        color: "#3B82F6",
        action: "/profile",
    },

    {
        id: 2,
        icon: "list-outline",
        title: "Orders",
        color: "#10B981",
        action: "/order",
    },

    {
        id: 3,
        icon: "location-outline",
        title: "Addressess",
        color: "#F59E0B",
        action: "/address",
    },

    {
        id: 4,
        icon: "heart-outline",
        title: "Wishlist",
        color: "#EF4444",
        action: "/wishlist",
    },
];

export default function Page()
{
    const { signOut } = useAuth();
    const { user } = useUser();

    const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) =>
    {
        if (action === "/profile") return;
        // @ts-ignore
        router.push(action);
    }

    return (
        <SafeScreen>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View
                    className="px-6 pb-8">
                    <View
                        className="bg-surface rounded-3xl p-6">
                        <View
                            className="flex-row items-center">
                            <View
                                className="relative">
                                <Image
                                    source={ user?.imageUrl }
                                    style={{ width: 80, height: 80, borderRadius: 40 }}
                                    transition={200}
                                />
                                <View
                                    className="absolute bottom-0 right-0 bg-primary rounded-full items-center justify-center border-2 border-surface">
                                    <Ionicons name="checkmark" size={16} color="#121212" />
                                </View>
                            </View>

                            <View
                                className="flex-1 ml-4">
                                <Text
                                    className="text-text-primary text-2xl font-bold mb-1">
                                    {user?.firstName} {user?.lastName}
                                </Text>
                                <Text
                                    className="text-text-secondary text-sm">
                                    {user?.emailAddresses[0].emailAddress}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View
                    className="flex-row flex-wrap gap-3 mx-6 mb-6">
                    {MENU_ITEMS.map(item => (
                        <TouchableOpacity
                            className="bg-surface rounded-2xl p-6 items-center justify-center"
                            style={{ width: "48%" }}
                            activeOpacity={0.7}
                            onPress={() => handleMenuPress(item.action)}
                            key={item.id}>
                            <View
                                style={{ backgroundColor: item.color + "20" }}
                                className="rounded-full size-16 items-center justify-center mb-4">
                                <Ionicons name={item.icon as any} size={28} color={item.color} />
                            </View>
                            <Text
                                className="text-text-primary font-bold text-base">
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Notification Link */}
                <View
                    className="mb-6 mx-6 bg-surface rounded-2xl p-4">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-row items-center justify-between py-2">
                        <View
                            className="flex-row items-center">
                            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                            <Text
                                className="text-text-primary font-semibold ml-3">
                                Notification
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#666666" />
                    </TouchableOpacity>
                </View>

                {/* Privacy and Security Link */}
                <View
                    className="mb-6 mx-6 bg-surface rounded-2xl p-4">
                    <TouchableOpacity
                        onPress={() => router.push("/privacy-security")}
                        activeOpacity={0.7}
                        className="flex-row items-center justify-between py-2">
                        <View
                            className="flex-row items-center">
                            <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
                            <Text
                                className="text-text-primary font-semibold ml-3">
                                Privacy & Security
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#666666" />
                    </TouchableOpacity>
                </View>

                {/* Sign Out Link */}
                <TouchableOpacity
                    className="mx-6 mb-6 bg-red-500/15 rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
                    activeOpacity={0.8}
                    onPress={() => signOut()}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text
                        className="text-red-500 font-bold text-base ml-2">
                        Sign Out
                    </Text>
                </TouchableOpacity>

                <Text
                    className="mx-6 mb-3 text-center text-text-secondary text-xs">
                    Version 1.0.0
                </Text>
            </ScrollView>
        </SafeScreen>
    );
}