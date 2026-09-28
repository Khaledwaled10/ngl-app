import { config } from "dotenv";

config();

import "./common/db/mongoose.js";

import express from "express";
import cors from "cors";

import authRouter from "./app/auth/auth.route.js";
import userRouter from "./app/user/user.route.js";
import messageRouter from "./app/message/message.route.js";
import { logger } from "./common/logger/logger.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

app.get("/test", (req, res) => {
  res.json({
    message: "test success",
    success: true,

  });
});

app.use((err, req, res, next) => {
    logger.error(err)
  if (err.isOptional) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,

    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});



app.listen(3030, () => {
  logger.info("Server start in port 3030");
});