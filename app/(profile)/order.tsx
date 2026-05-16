import { View, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { useReview } from "@/hooks/useReview";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";
import LoadingUI from "@/components/LoadingUI";
import EmptyOrderScreen from "@/components/EmptyOrderScreen";
import ErrorUI from "@/components/ErrorUI";
import OrderItem from "@/components/OrderItem";
import type { Order } from "@/type";
import RatingModal from "@/components/RatingModal";

export default function Page()
{
    let { data: orders, isLoading, isError } = useOrder();
    let { createReviewAsync, isCreatingReview } = useReview();

    let [showRatingModal, setShowRatingModal] = useState(false);
    let [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    let [productRatings, setProductRatings] = useState<Record<string, number>>({});

    const handleOpenRating = (order: Order) =>
    {
        setShowRatingModal(true);
        setSelectedOrder(order);

        // init ratings for all products to 0
        let initialRatings: Record<string, number> = {}

        order.orderItems.forEach(item =>
        {
            let productId = item.product._id;
            initialRatings[productId] = 0;
        });
        setProductRatings(initialRatings);
    }

    const handleSubmitRating = async () =>
    {
        if (!selectedOrder) return;

        let allRated = Object.values(productRatings).every(rating => rating > 0);

        if (!allRated)
        {
            Alert.alert("Error", "Please rate all products");
            return;
        }

        try
        {
            await Promise.all(
                selectedOrder.orderItems.map(item =>
                {
                    createReviewAsync({
                        productId: item.product._id,
                        orderId: selectedOrder?._id,
                        rating: productRatings[item.product._id]
                    });
                })
            );

            Alert.alert("Success", "Thank you for rating all products!");
            setShowRatingModal(false);
            setSelectedOrder(null);
            setProductRatings({});
        }
        catch (e: any)
        {
            Alert.alert("Error", e?.response?.data?.error || "Failed to submit rating");
        }
    }

    if (isLoading) return <LoadingUI title="Order" />;

    if (isError) return <ErrorUI title="Order" />;

    if (!orders || orders.length === 0) return <EmptyOrderScreen />;

    return (
        <SafeScreen>
            <ScreenHeader title="Order" />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ marginBottom: 100 }}>
                <View
                    className="px-6 py-4 gap-4">
                    {orders.map(order => <OrderItem order={order} onOpen={handleOpenRating} key={order._id} />)}
                </View>
            </ScrollView>

            <RatingModal
                visible={showRatingModal}
                order={selectedOrder}
                onClose={() => setShowRatingModal(false)}
                productRatings={productRatings}
                onSubmit={handleSubmitRating}
                isSubmitting={isCreatingReview}
                onRatingChange={(productId, rating) =>
                {
                    setProductRatings(prev => ({ ...prev, [productId]: rating}));
                }}
            />
        </SafeScreen>
    );
}