import { AppError } from "../../../common/error/appError.js";



export function passwordNotMatch() {
  throw new AppError("Email or password is incorrect", 401);
}

export function otpExpired() {
  throw new AppError("Otp Expired, please resend", 400);
}

export function invalidOtp() {
  throw new AppError("Code is Invalid", 400);
}