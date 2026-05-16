import { requireAuth, getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = async (req, res, next) =>
{
    try
    {
        let { userId } = getAuth(req);
        if (!userId)
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        let user = await User.findOne({ clerkId: userId });

        if (!user)
            return res.status(404).json({ message: "User not found" });
        req.user = user;

        next();
    }
    catch(e)
    {
        console.error("Error in protectRoute middleware: ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const adminOnly = (req, res, next) =>
{
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized - user not found" });

    if (req.user.email !== ENV.ADMIN_EMAIL)
        return res.status(403).json({ message: "Forbidden - admin access only" });

    next();
}