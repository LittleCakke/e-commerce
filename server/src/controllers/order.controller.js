import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req, res)
{
    try
    {
        let user = req.user;
        let {
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0)
            return res.status(400).json({ error: "No order items" });

        // validate products and their stock
        // TODO)) check later in the video if this is actually working
        for (let item of orderItems)
        {
            let product = await Product.findById(item.product._id);
            if (!product)
                return res.status(404).json({ error: `Product ${item.name} not found` });
            if (product.stock < item.quantity)
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        }
        let order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice,
        });

        // update product stock
        for (let item of orderItems)
        {
            // TODO)) check later in the video if this is actually working
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        res.status(201).json({
            message: "Order created successfully",
            order
        });
    }
    catch(e)
    {
        console.error("Failed to fetch customers", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUserOrders(req, res)
{
    try
    {
        let orders = await Order
            .find({ clerkId: req.user.clerkId })
            .populate("orderItems.product")
            .sort({ createdAt: -1 });

        let orderIds = orders.map(order => order._id);
        let reviews = await Review.find({ orderId: { $in: orderIds } });
        let reviewedOrderIds = new Set(reviews.map(review => review.orderId.toString()));

        let ordersWithReviewStatus = await Promise.all(
            orders.map(async order =>
            {
                return {
                    ...order.toObject(),
                    hasReviewed: reviewedOrderIds.has(order._id.toString())
                }
            })
        );

        res.status(200).json({ orders: ordersWithReviewStatus });
    }
    catch(e)
    {
        console.error("Failed to fetch customers", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}