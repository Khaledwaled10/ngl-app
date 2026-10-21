import { Router } from "express";
import * as authCotroller from "./controller/auth.controller.js";
import { idEmpotency } from "../../lib/idEmpotency/idEmpotency.js";
import * as authService from './service/auth.service.js'
import { guard } from "../../lib/auth/guard.js";


const authRouter=Router();
authRouter.post("/login", authCotroller.login);
authRouter.post("/register",authCotroller.register );
authRouter.patch('/verify-account',authCotroller.verfiyAccount)
authRouter.post('/sendOtp',authCotroller.sendotp)
authRouter.patch('/reset-password',idEmpotency(),authCotroller.resetPassword)
authRouter.post('/loginWithGmail',authCotroller.loginWithGoogle)


authRouter.post("/2fa/enable", guard, authCotroller.enableTwoFactor);

authRouter.post(
  "/2fa/verify-enable",
  guard,
  authCotroller.verifyEnableTwoFactor
);


authRouter.post("/login/confirm", authCotroller.confirmLogin);
authRouter.get("/test-email", async (req, res, next) => {
  try {

    await authService.testEmail();

    return res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    next(error);
  }
});



export default authRouter;

