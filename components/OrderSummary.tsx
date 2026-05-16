import { Text, View } from "react-native";
import type { OrderSummaryProps } from "@/type";

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps)
{
    return (
        <View
            className="px-6 mt-6">
            <View
                className="bg-surface rounded-3xl p-5">
                <Text
                    className="text-white text-xl font-bold mb-4">
                    Summary
                </Text>
                <View
                    className="space-y-3">
                    <View
                        className="flex-row justify-between items-center">
                        <Text
                            className="text-text-secondary text-base">
                            Subtotal
                        </Text>
                        <Text
                            className="text-white font-semibold text-base">
                            ${subtotal.toFixed(2)}
                        </Text>
                    </View>

                    <View
                        className="flex-row justify-between items-center">
                        <Text
                            className="text-text-secondary text-base">
                            Shipping
                        </Text>
                        <Text
                            className="text-white font-semibold text-base">
                            ${shipping.toFixed(2)}
                        </Text>
                    </View>

                    <View
                        className="flex-row justify-between items-center">
                        <Text
                            className="text-text-secondary text-base">
                            Tax
                        </Text>
                        <Text
                            className="text-white font-semibold text-base">
                            ${tax.toFixed(2)}
                        </Text>
                    </View>

                    <View
                        className="flex-row justify-between items-center">
                        <Text
                            className="text-white font-bold text-lg">
                            Total
                        </Text>
                        <Text
                            className="text-primary font-bold text-2xl">
                            ${total.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}