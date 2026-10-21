import { toMs } from "../../../pkj/time/time.js";
import { validationBody } from "../../../lib/validation/validation.js";
import { loginDto, registerDto, sentDto, verfiyDto } from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js";
import { resetPasswordDto } from "./../dto/auth.dto.js";

export async function register(req, res, next) {
  try {
    const data = validationBody(registerDto, req.body);
    const user = await authService.register(data);

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function verfiyAccount(req, res, next) {
  try {
    const data = validationBody(verfiyDto, req.body);
    const { email, code } = data;

    const userUpdate = await authService.verfiyAccount(email, code);

    return res.status(200).json({
      message: "User Verfied successfully",
      success: true,
      data: userUpdate,
    });
  } catch (error) {
    next(error);
  }
}




export async function login(req, res, next) {
  try {
    const data = validationBody(loginDto, req.body);
    const { email, password } = data;

    const result = await authService.login(email, password);

    if (result.requiresTwoFactor) {
      return res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        message: "Verification code sent to your email",
      });
    }

    res.cookie("access_token", result.token, {
      httpOnly: true,
      maxAge: toMs(1, "hours"),
    });

    return res.status(200).json({
      success: true,
      requiresTwoFactor: false,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}




export async function sendotp(req, res, next) {
  const data = validationBody(sentDto, req.body);

  const { email } = data;
  try {
    const token = await authService.sendOtp(email);
    return res.status(201).json({
      message: "Send Otp successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  const data = validationBody(resetPasswordDto, req.body);

  const { email, code, newPassword } = data;
  try {
    await authService.resetPassword(email, code, newPassword);
    return res.status(201).json({
      message: "Reset Password successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginWithGoogle(req, res, next) {
  try {
    const token = await authService.loginGoogle(req.body.idToken);

    console.log("TOKEN FROM SERVICE:", token);
    console.log("TOKEN TYPE:", typeof token);

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "hours"),
    });

    return res.status(201).json({
      message: "Login With Google successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function enableTwoFactor(req, res, next) {
  try {
    await authService.enableTwoFactor(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEnableTwoFactor(req, res, next) {
  try {
    const { code } = req.body;
    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "Code must be 6 digits",
      });
    }

    const result = await authService.verifyEnableTwoFactor(req.user.id, code);

    return res.status(200).json({
      success: true,
      message: "Two-factor verification enabled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}





export async function confirmLogin(req, res, next) {
  try {
    const { email, password, code } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof code !== "string" ||
      !/^\d{6}$/.test(code)
    ) {
      return res.status(400).json({
        success: false,
        message: "Email, password, or verification code is invalid",
      });
    }

    const token = await authService.confirmLogin(
      email,
      password,
      code
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "hours"),
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}