import { AppError } from "../../../common/error/appError.js";

export function userExist() {
  throw new AppError("User exist", 409);
}

export function userNotExist() {
  throw new AppError("Email or password is incorrect", 404);
}


export function userAlreadyVerified() {
  throw new AppError("User is Verified", 400);
}

export function userNotVerified() {
  throw new AppError("User is not verified", 403);
}
