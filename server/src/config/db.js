import mongoose from "mongoose";
import { ENV } from "./env.js";
import { logger } from "./log.js";

export const connectDB = async () =>
{
    try
    {
        let conn = await mongoose.connect(ENV.DB_URL);
        logger.info(`✅ Connected to MONGO_DB: ${conn.connection.host}`);
    }
    catch(e)
    {
        logger.error("❌ errors occurred when connected mongo db.");
        process.exit(1);
    }
}