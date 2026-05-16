import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal, Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import type { AddressFormModalProps } from "@/type";

export default function AddressFormModal({
    visible,
    isEditing,
    addressForm,
    isAddingAddress,
    isUpdatingAddress,
    onClose,
    onSave,
    onFormChange
}: AddressFormModalProps)
{
    return (
        <Modal
            animationType="slide"
            transparent
            onRequestClose={onClose}
            visible={visible}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <SafeScreen>
                    {/* region Header */}
                    <View
                        className="px-6 py-5 border-surface flex-row items-center justify-between">
                        <Text
                            className="text-white text-2xl font-bold">
                            {isEditing ? "Edit Address" : "Add New Address"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    {/* endregion */}

                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}>
                        <View
                            className="p-6 gap-6">
                            {/* region Label input */}
                            <View
                                className="gap-3">
                                <Text
                                    className="text-white font-semibold">
                                    Label
                                </Text>
                                <TextInput
                                    className="bg-surface text-white p-4 rounded-2xl text-base"
                                    placeholder="e.g., Home, Work, Office"
                                    placeholderTextColor="#666666"
                                    value={addressForm.label}
                                    onChangeText={text => onFormChange({ ...addressForm, label: text })}
                                />
                            </View>
                            {/* endregion */}

                            {/* region Name Input */}
                            <View
                                className="gap-3">
                                <Text
                                    className="text-white font-semibold">
                                    Full Name
                                </Text>
                                <TextInput
                                    className="bg-surface text-white p-4 rounded-2xl text-base"
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#666666"
                                    value={addressForm.fullName}
                                    onChangeText={text => onFormChange({ ...addressForm, fullName: text })}
                                />
                            </View>
                            {/* endregion */}

                            {/* region Address Input */}
                            <View
                                className="gap-3">
                                <Text
                                    className="text-white font-semibold">
                                    Street Address
                                </Text>
                                <TextInput
                                    className="bg-surface text-white p-4 rounded-2xl text-base"
                                    placeholder="Street address, apt/suite number"
                                    placeholderTextColor="#666666"
                                    value={addressForm.streetAddress}
                                    onChangeText={text => onFormChange({ ...addressForm, streetAddress: text })}
                                />
                            </View>
                            {/* endregion */}

                            {/* region City Input */}
                            <View
                                className="gap-3">
                                <Text
                                    className="text-white font-semibold">
                                    City
                                </Text>
                                <TextInput
                                    className="bg-surface text-white p-4 rounded-2xl text-base"
                                    placeholder="e.g., New York"
                                    placeholderTextColor="#666666"
                                    value={addressForm.city}
                                    onChangeText={text => onFormChange({ ...addressForm, city: text })}
                                />
                            </View>
                            {/* endregion */}

                            {/* region State Input */}
                            <View
                                className="gap-3">
                                <Text
                                    className="text-white font-semibold">
                                    State / Province
                                </Text>
                                <TextInput
                                    className="bg-surface text-white p-4 rounded-2xl text-base"
                                    placeholder="e.g., NY"
                                    placeholderTextColor="#666666"
                                    value={addressForm.state}
                                    onChangeText={text => onFormChange({ ...addressForm, state: text })}
                                />
                            </View>
                            {/* endregion */}

                            {/* region Zip Code Input */}
                            <View
                                className="gap-3">
                                <Text
                                    className="text-white font-semibold">
                                    ZIP Code
                                </Text>
                                <TextInput
                                    className="bg-surface text-white p-4 rounded-2xl text-base"
                                    placeholder="e.g., 10001"
                                    placeholderTextColor="#666666"
                                    value={addressForm.zipCode}
                                    onChangeText={text => onFormChange({ ...addressForm, zipCode: text })}
                                    keyboardType="numeric"
                                />
                            </View>
                            {/* endregion */}

                            {/* region Phone Number Input */}
                            <View
                                className="gap-3">
                                <Text
                                    className="text-white font-semibold">
                                    Phone Number
                                </Text>
                                <TextInput
                                    className="bg-surface text-white p-4 rounded-2xl text-base"
                                    placeholder="+1 (555) 123-4567"
                                    placeholderTextColor="#666666"
                                    value={addressForm.phoneNumber}
                                    onChangeText={text => onFormChange({ ...addressForm, phoneNumber: text })}
                                    keyboardType="phone-pad"
                                />
                            </View>
                            {/* endregion */}

                            {/* region Default Address Toggle */}
                            <View
                                className="bg-surface rounded-2xl px-4 py-1 flex-row items-center justify-between">
                                <Text
                                    className="text-white font-semibold">
                                    Set as default address
                                </Text>
                                <Switch
                                    value={addressForm.isDefault}
                                    onValueChange={value => onFormChange({ ...addressForm, isDefault: value })}
                                    thumbColor="white"
                                />
                            </View>
                            {/* endregion */}

                            {/* region Save Button */}
                            <TouchableOpacity
                                className="bg-primary py-4 justify-center items-center rounded-2xl"
                                onPress={onSave}
                                disabled={isAddingAddress || isUpdatingAddress}>
                                {isAddingAddress || isUpdatingAddress ? (
                                    <ActivityIndicator size="small" color="#121212" />
                                ) : (
                                    <Text
                                        className="text-background font-bold text-lg">
                                        {isEditing ? "Save Changes" : "Add Address"}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            {/* endregion */}
                        </View>
                    </ScrollView>
                </SafeScreen>
            </KeyboardAvoidingView>
        </Modal>
    );
}