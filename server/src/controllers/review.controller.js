import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createReview(req, res)
{
    try
    {
        let {
            productId,
            orderId,
            rating,
        } = req.body;

        if (!rating || rating < 1 || rating > 5)
            return res.status(400).json({ error: "Rating must be between 1 and 5" });

        let user = req.user;

        // verify order exists and is delivered
        let order = await Order.findById(orderId);
        if (!order)
            return res.status(404).json({ error: "Order not found" });

        if (order.clerkId !== user.clerkId)
            return res.status(403).json({ error: "Not authorized to review this order" });

        if (order.status !== "delivered")
            return res.status(400).json({ error: "Can only review delivered orders" });

        // verify product is in the order
        let productInOrder = order.orderItems.find(item => item.product.toString() === productId.toString());
        if (!productInOrder)
            return res.status(404).json({ error: "Product not found in this order" });

        // check if review already exists
        let existingReview = await Review.findOne({
            productId,
            userId: user._id,
        });

        let review = await Review.findOneAndUpdate({ productId, userId: user._id }, {
            rating,
            orderId,
            productId,
            userId: user._id
        }, {
            new: true,
            upsert: true,
            runValidators: true
        });

        let reviews = await Review.find({ productId });
        let totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        let updatedProduct = await Product.findByIdAndUpdate(productId, {
            averageRating: totalRating / reviews.length,
            totalReivews: reviews.length,
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct)
        {
            await Review.findByIdAndDelete(review._id);
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(201).json({
            message: "Review submitted successfully",
            review
        });
    }
    catch(e)
    {
        console.error("Failed to create review", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteReview(req, res)
{
    try
    {
        let { reviewId } = req.params;
        let user = req.user;

        let review = await Review.findById(reviewId);
        if (!review)
            return res.status(404).json({ error: "Review not found" });

        if (review.userId.toString() !== user._id.toString())
            return res.status(403).json({ error: "Not authorized to delete this review" });

        let productId = review.productId;
        await Review.findByIdAndDelete(reviewId);

        let reviews = await Review.find({ productId });
        let totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        await Product.findByIdAndUpdate(productId, {
            averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReviews: reviews.length
        });

        res.status(200).json({ message: "Review deleted successfully" });
    }
    catch(e)
    {
        console.error("Failed to delete review", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}