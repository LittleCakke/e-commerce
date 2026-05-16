import { useState } from "react";
import { View, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useApi } from "@/lib/api";
import useAddress from "@/hooks/useAddress";
import useCart from "@/hooks/useCart";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import CartItem from "@/components/CartItem";
import CartScreenEmptyUI from "@/components/CartScreenEmptyUI";
import CartScreenErrorUI from "@/components/CartScreenErrorUI";
import CartScreenLoadingUI from "@/components/CartScreenLoadingUI";
import OrderSummary from "@/components/OrderSummary";
import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import type { Address } from "@/type";

export default function Page()
{
    // region states and data
    let api = useApi();
    let {
        cart,
        cartItemCount,
        cartTotal,
        clearCart,
        isError,
        isLoading,
    } = useCart();
    let { addresses } = useAddress();

    let { initPaymentSheet, presentPaymentSheet } = useStripe();

    let [ paymentLoading, setPaymentLoading ] = useState(false);
    let [ addressModalVisible, setAddressModalVisible ] = useState(false);

    let cartItems = cart?.items || [];
    let subtotal = cartTotal;
    let shipping = 10.0;
    let tax = subtotal * 0.08;
    let total = subtotal + shipping + tax;
    // endregion

    // region methods
    const handleCheckout = () =>
    {
        if (cartItems.length === 0) return;

        // check if user has addresses
        if (!addresses || addresses.length === 0)
        {
            Alert.alert("No Address", "Please add a shipping address in your profile before checking out.",[{ text: "OK" }]);
            return;
        }
        // show address selection modal
        setAddressModalVisible(true);
    }

    const handleProcessWithPayment = async (selectedAddress: Address) =>
    {
        setAddressModalVisible(false);
        try
        {
            setPaymentLoading(true);

            // @ts-ignore create payment intent with cart items and shipping address
            let { data } = await api.post("/payment/create-intent", {
                cartItems,
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    streetAddress: selectedAddress.streetAddress,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zipCode: selectedAddress.zipCode,
                    phoneNumber: selectedAddress.phoneNumber
                }
            });

            let { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: data.clientSecret,
                merchantDisplayName: "Expo E-Commerce Store"
            });

            if (initError)
            {
                Alert.alert("Error", initError.message);
                setPaymentLoading(false);
                return;
            }
            // present payment sheet
            let { error: presentError } = await presentPaymentSheet();

            if (presentError)
                Alert.alert("Payment cancelled", presentError.message);
            else
            {
                Alert.alert("Success", "Your payment was successful! Your order is being processed.", [
                    {
                        text: "OK",
                        onPress: () =>
                        {
                        }
                    }
                ]);
                clearCart();
            }
        }
        catch (e: any)
        {
            console.error("Payment failed: ", e.message);
            Alert.alert("Error", "Failed to process payment");
        }
        finally
        {
            setPaymentLoading(false);
        }
    }
    // endregion

    if (isLoading) return <CartScreenLoadingUI />;

    if (isError) return <CartScreenErrorUI />;

    if (cartItems.length === 0) return <CartScreenEmptyUI />;

    return (
        <SafeScreen>
            <Text
                className="text-white px-6 pb-5 text-3xl font-bold tracking-tight">
                Cart
            </Text>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 240 }}>
                <View
                    className="px-6 gap-y-4">
                    {cartItems.map((item) => (<CartItem item={item} key={item._id} />))}
                </View>

                <OrderSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    total={total}
                />
            </ScrollView>

            <View
                className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-surface pt-4 pb-32 px-6">
                {/* Quick Stats */}
                <View
                    className="flex-row items-center justify-between mb-4">
                    <View
                        className="flex-row items-center">
                        <Ionicons name="cart" size={20} color={"#1DB954"} />
                        <Text
                            className="text-text-secondary ml-2">
                            {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                        </Text>
                    </View>
                    <View
                        className="flex-row items-center">
                        <Text
                            className="text-white font-bold text-xl">
                            ${total.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Checkout Button */}
                <TouchableOpacity
                    className="bg-primary rounded-2xl overflow-hidden"
                    activeOpacity={0.9}
                    onPress={handleCheckout}
                    disabled={paymentLoading}>
                    <View
                        className="py-5 flex-row items-center justify-center">
                        {paymentLoading ? (
                            <ActivityIndicator size="small" color={"#121212"} />
                        ) : (
                            <>
                                <Text
                                    className="text-background font-bold text-lg mr-2">
                                    Checkout
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color={"#121212"} />
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <AddressSelectionModal
                visible={addressModalVisible}
                onClose={() => setAddressModalVisible(false)}
                onProceed={handleProcessWithPayment}
                isProcessing={paymentLoading}
            />
        </SafeScreen>
    );
}