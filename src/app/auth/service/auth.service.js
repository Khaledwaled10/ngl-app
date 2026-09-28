import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import crypto from "crypto";
import { sendEmail } from "../../../common/email/mailer.js";
import * as errorAuth from"../error/error.js"
import * as errorUser from "../../user/error/error.js"
import * as userRepository from "../../user/repository/user.repository.js";
import { toMs } from "../../../common/time/time.js";
import { genrateToken } from "../utilts/token.js";
import { comparePassword, hashPassword } from "../utilts/hash.js";

export async function register(userData) {

  const userExist = await authRepository.userExist(userData.email);
  if (userExist){
errorUser.userExist()
  }

  userData.password = await hashPassword(userExist.password)
  const Createuser = await authRepository.createUser(userData);
  const code = crypto.randomInt(100000, 999999).toString();
  await otpRepository.createOtp({
    code: code,
    email: userData.email,
    expiredAt: new Date(Date.now() + toMs(5, "minutes")),
  });
  await sendEmail(
    userData.email,
    "Vervication code",
    `<h1>OTP CODE: ${code}</h1>`,
  );
  return Createuser;
}

export async function verfiyAccount(email, code) {
  // user exist
  const userExist = await authRepository.userExist(email);

  if (!userExist){
    errorUser.userNotExist();
  };

  //acount verfied
  if (userExist.isVerified == true){
    errorUser.userAlreadyVerified()
  };

  //code exist

  const otp = await otpRepository.getOtp(email);
  if (!otp){
    errorAuth.otpExpired()
  };
  //code true
  if (otp.code !== code) {
    errorAuth.invalidOtp()
  };

  //update user
  const updateUser = await userRepository.updateUser(email, {
    isVerified: true,
  });

  //delet otp
  await otpRepository.deleteOtp(email);

  return updateUser;
}

export async function login(email, password) {
  //exist user

  const userExist = await authRepository.userExist(email);

  if (!userExist) {
    errorUser.userNotExist()
  };

  //user verfied

  if (!userExist.isVerified){
  errorUser.userNotVerified()
  };
  //compare password

  const match = await comparePassword(password,userExist.password);
  if (!match){
    errorAuth.passwordNotMatch()
  };

  //gen tokeen
  const token =genrateToken({id:userExist.id,name:userExist.name})
  return token;
}

export async function sendOtp(email) {
  //user exist

  const user = await authRepository.userExist(email);

  if (!user){
    errorUser.userNotExist()
  };

  

  //delete old otp

  await otpRepository.deleteOtp(email);

  //generate otp

  const code = crypto.randomInt(100000, 999999).toString();
  await otpRepository.createOtp({
    code,
    email: user.email,
    expiredAt: new Date(Date.now() + toMs(5, "minutes")),
  });

  //send otp
  sendEmail(user.email, "Vervication code", `<h1>OTP CODE: ${code}</h1>`);
}


export async function resetPassword(email,code,newPasssword) {

  //check otp exist 
const otp= await otpRepository.getOtp(email)
if(!otp) {
  errorAuth.otpExpired()
}
  //check otp true
if(otp.code!==code){
  errorAuth.invalidOtp()
}
  //

  const hash_password=await hashPassword(newPasssword)

  await userRepository.updateUser(email,{password:hash_password})

otpRepository.deleteOtp(email)
  
}