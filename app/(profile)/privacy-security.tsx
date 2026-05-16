import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import PrivacySecurityCard from "@/components/PrivacySecurityCard";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";
import type { PrivacySecurityItem } from "@/type";

export default function Page()
{
    // region states
    let [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    let [biometricEnabled, setBiometricEnabled] = useState(true);
    let [pushNotifications, setPushNotifications] = useState(true);
    let [emailNotifications, setEmailNotifications] = useState(true);
    let [marketingEmails, setMarketingEmails] = useState(false);
    let [shareData, setShareData] = useState(false);
    // endregion

    const settings: PrivacySecurityItem[] = [
        {
            title: "Security",
            items: [
                {
                    id: "password",
                    icon: "lock-closed-outline",
                    title: "Change Password",
                    description: "Update your account password",
                    type: "navigation"
                },

                {
                    id: "two-factor",
                    icon: "shield-checkmark-outline",
                    title: "Two-Factor Authentication",
                    description: "Add an extra layer of security",
                    type: "toggle",
                    value: twoFactorEnabled
                },

                {
                    id: "biometric",
                    icon: "finger-print-outline",
                    title: "Biometric Login",
                    description: "Use Face ID or Touch ID",
                    type: "toggle",
                    value: biometricEnabled
                },
            ]
        },

        {
            title: "Privacy",
            items: [
                {
                    id: "push",
                    icon: "notifications-outline",
                    title: "Push Notifications",
                    description: "Receive push notifications",
                    type: "toggle",
                    value: pushNotifications
                },

                {
                    id: "email",
                    icon: "mail-outline",
                    title: "Email Notifications",
                    description: "Receive order updates via email",
                    type: "toggle",
                    value: emailNotifications
                },

                {
                    id: "marketing",
                    icon: "megaphone-outline",
                    title: "Marketing Emails",
                    description: "Receive promotional emails",
                    type: "toggle",
                    value: marketingEmails
                },

                {
                    id: "data",
                    icon: "analytics-outline",
                    title: "Share Usage Data",
                    description: "Help us improve the app",
                    type: "toggle",
                    value: shareData
                }
            ]
        },

        {
            title: "Account",
            items: [
                {
                    id: "activity",
                    icon: "time-outline",
                    title: "Account Activity",
                    description: "View recent login activity"
                },

                {
                    id: "devices",
                    icon: "phone-portrait-outline",
                    title: "Connected Devices",
                    description: "Manage devices with access"
                },

                {
                    id: "data-download",
                    icon: "download-outline",
                    title: "Download Your Data",
                    description: "Get a copy of your data"
                }
            ]
        }
    ];

    const handleToggle = (id: string, value: boolean) =>
    {
        switch (id)
        {
            case "two-factor":
                setTwoFactorEnabled(value);
                break;
            case "biometric":
                setBiometricEnabled(value);
                break;
            case "push":
                setPushNotifications(value);
                break;
            case "email":
                setEmailNotifications(value);
                break;
            case "marketing":
                setMarketingEmails(value);
                break;
            case "data":
                setShareData(value);
                break;
        }
    }

    return (
        <SafeScreen>
            <ScreenHeader title="Privacy & Security" />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 75 }}>
                {/* Settings */}
                {settings.map(i => <PrivacySecurityCard key={i.title} card={i} handleToggle={handleToggle} />)}

                {/* region Delete Account Button */}
                <View
                    className="px-6 pt-4">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="bg-red-500/20 rounded-2xl p-5 flex-row items-center justify-between border-2 border-red-500/20">
                        <View
                            className="flex-row items-center">
                            <View
                                className="size-12 items-center justify-center mr-4">
                                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                            </View>
                            <View>
                                <Text
                                    className="text-red-500 font-bold text-base mb-1">
                                    Delete Account
                                </Text>
                                <Text
                                    className="text-red-300 text-sm">
                                    Permanently delete your account
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
                {/* endregion */}

                {/* region Information Alert */}
                <View
                    className="px-6 pt-6 pb-4">
                    <View
                        className="bg-primary/10 rounded-2xl p-4 flex-row">
                        <Ionicons name="information-circle-outline" size={24} color="#1DB954" />
                        <Text
                            className="text-text-secondary text-sm ml-3 flex-1">
                            We take your privacy seriously. Your data is encrypted and stored securely. You can manage your privacy settings at any time.
                        </Text>
                    </View>
                </View>
                {/* endregion */}
            </ScrollView>
        </SafeScreen>
    );
}