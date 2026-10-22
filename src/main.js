import { config } from "dotenv";

config();

import { connectDB } from "./lib/db/mongoose.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./app/auth/auth.route.js";
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";

import { globalErrorHandler } from "./pkj/error/error.handler.js";
import { correlationId } from "./lib/correlationId/correlationId.js";

export function createApp(){


  
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use('/uploads',express.static('uploads'))
app.use(express.json());

app.use(correlationId);


app.use(cookieParser());

app.use("/auth", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}, authRouter);



app.use("/user", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}, userRouter);

app.use("/message", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}, messageRouter);



app.get("/test", (req, res) => {
  console.log('success')
  res.json({
    message: "test success",
    success: true,

  });
});

app.use(
  
globalErrorHandler
);





return app;

}