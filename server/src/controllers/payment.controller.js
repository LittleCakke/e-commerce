import { Stripe } from "stripe";
import { ENV } from "../config/env.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res)
{
    try
    {
        let { cartItems, shippingAddress } = req.body;
        let user = req.user;

        // validate cart items
        if (!cartItems || cartItems.length === 0)
            return res.status(400).json({ error: "Cart is empty" });

        // Calculate total from server-side (don't trust client - ever)
        let subtotal = 0;
        const validatedItems = [];

        for (let cartItem of cartItems)
        {
            let product = await Product.findById(cartItem.product._id);
            if (!product)
                return res.status(404).json({ error: `Product "${cartItem.product.name}" not found` });

            if (product.stock < cartItem.quantity)
                return res.status(400).json({ error: `Insufficient stock for "${product.name}"` });

            subtotal += product.price * cartItem.quantity;

            validatedItems.push({
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.images[0]
            });
        }
        let shipping = 10.0;
        let tax = subtotal * 0.08;
        let total = subtotal + shipping + tax;

        if (total <= 0)
            return res.status(400).json({ error: "Invalid order total" });

        // find or create the stripe customer
        let customer;
        if (user.stripeCustomerId)
            // find the customer
            customer = await stripe.customers.retrieve(user.stripeCustomerId);
        else
        {
            customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    clerkId: user.clerkId,
                    userId: user._id.toString()
                }
            });

            await User.findByIdAndUpdate(user._id, {
                stripeCustomerId: customer.id
            });
        }

        let paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // convert to cents
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true
            },
            metadata: {
                clerkId: user.clerkId,
                userId: user._id.toString(),
                orderItems: JSON.stringify(validatedItems),
                shippingAddress: JSON.stringify(shippingAddress),
                totalPrice: total.toFixed(2)
            },
            // in the webhooks section we will use this metadata
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }
    catch(e)
    {
        console.error("Failed to create payment intent, ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleWebhook(req, res)
{
    let sig = req.headers["stripe-signature"];
    let event;

    try
    {
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
    }
    catch(e)
    {
        console.error("Webhook signature verification failed:", e.message);
        return res.status(400).send(`Webhook Error: ${e.message}`);
    }

    if (event.type === "payment_intent.succeeded")
    {
        let paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);
        try
        {
            let {
                userId,
                clerkId,
                orderItems,
                shippingAddress,
                totalPrice
            } = paymentIntent.metadata;

            let existingOrder = await Order.findOne({ "paymentResult.id": paymentIntent.id });
            if (existingOrder)
            {
                console.log("Order already exists for payment:", paymentIntent.id);
                return res.json({ received: true });
            }

            // create order
            let order = await Order.create({
                user: userId,
                clerkId,
                orderItems: JSON.parse(orderItems),
                shippingAddress: JSON.parse(shippingAddress),
                paymentResult: {
                    id: paymentIntent.id,
                    status: "succeeded",
                },
                totalPrice: parseFloat(totalPrice)
            });

            // update product stock
            let items = JSON.parse(orderItems);
            for (let item of items)
            {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
            console.log("Order created successfully:", order._id);
        }
        catch(e)
        {
            console.error("Error creating order from webhook:", e.message);
        }
    }

    res.json({ received: true });
}