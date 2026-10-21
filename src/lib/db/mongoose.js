
import mongoose from "mongoose";
import { config } from "dotenv";

config();

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
