import { Router } from "express";
import * as authCotroller from "./controller/auth.controller.js";
const authRouter=Router();
authRouter.post("/login", authCotroller.login);
authRouter.post("/register",authCotroller.register );
authRouter.patch('/verify-account',authCotroller.verfiyAccount)
authRouter.post('/sendOtp',authCotroller.sendotp)
authRouter.patch('/reset-password',authCotroller.resetPassword)


export default authRouter;

