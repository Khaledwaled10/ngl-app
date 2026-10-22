
import mongoose from "mongoose";
import { config } from "dotenv";

config();

let connectionPromise;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!process.env.MONGOOSE_URL) {
    throw new Error("MONGOOSE_URL is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGOOSE_URL, {
        serverSelectionTimeoutMS: 10000,
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  return connectionPromise;
}
