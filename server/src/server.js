import express, { json } from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { functions, inngest } from "./config/inngest.js";
import { logger } from "./config/log.js";

import adminRoutes from "./routes/admin.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import productRoutes from "./routes/product.route.js";
import reviewRoutes from "./routes/review.route.js";
import userRoutes from "./routes/user.route.js";
import paymentRoutes from "./routes/payment.route.js";

const app = express();

logger.level = "info";

const __dirname = path.resolve();

app.use(clerkMiddleware());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}));

// special handling: Stripe webhook needs raw body BEFORE an body parsing middleware
// apply raw body parser conditionally only to webhook endpoint
app.use("/api/payment",(req, res, next) =>
{
    if (req.originalUrl === "/api/payment/webhook")
        express.raw({type: "application/json"})(req, res, next);
    else
        // parse json for non-webhook routes
        express.json()(req, res, next);
}, paymentRoutes);

app.use(json());
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

if (ENV.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("/{*any}", (_req, res) =>
    {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    });
}

const startServer = async () =>
{
    await connectDB();
    app.listen(ENV.PORT, () =>
    {
        logger.info("Server is running on port 3000. http://localhost:3000");
    });
}

startServer();