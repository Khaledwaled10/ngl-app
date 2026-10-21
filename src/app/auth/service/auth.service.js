import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import crypto, { randomUUID } from "crypto";
import { sendEmail } from "../../../lib/email/mailer.js";
import * as errorAuth from"../error/error.js"
import * as errorUser from "../../user/error/error.js"
import * as userRepository from "../../user/repository/user.repository.js";
import { genrateToken } from "../utilts/token.js";
import { comparePassword, hashPassword } from "../utilts/hash.js";
import { verfiyGoogle } from "../utilts/googleLogin.js";
import { mailjetProvider } from "../../../lib/email/initMailJet.js";


export async function register(userData) {

  const userExist = await authRepository.userExist(userData.email);
  if (userExist){
errorUser.userExist()
  }

  userData.password = await hashPassword(userData.password)
  const Createuser = await authRepository.createUser(userData);
  const code = crypto.randomInt(100000, 999999).toString();
 
 await otpRepository.createOtp({
  email: userData.email,
  code,
});


  await mailjetProvider.sendmail(
    userData.email,
    "Vervication code",
    `<h1>OTP CODE: ${code}</h1>`,
  );
  return Createuser;
}

export async function verfiyAccount(email, code) {
  console.log("1. verifyAccount started", email);

  const userExist = await authRepository.userExist(email);
  console.log("2. user exists:", Boolean(userExist));

  if (!userExist) {
    errorUser.userNotExist();
  }

  if (userExist.isVerified === true) {
    errorUser.userAlreadyVerified();
  }

  const otp = await otpRepository.getOtp(email);
  console.log("3. OTP exists:", Boolean(otp));
  console.log("4. OTP types:", typeof otp, typeof code);

  if (!otp) {
    errorAuth.otpExpired();
  }

  if (String(otp) !== String(code)) {
    errorAuth.invalidOtp();
  }

  const updateUser = await userRepository.updateUser(email, {
    isVerified: true,
  });

  await otpRepository.deleteOtp(email);

  return updateUser;
}




export async function login(email, password) {
  const user = await authRepository.userExist(email);

  if (!user) {
    errorUser.userNotExist();
  }

  const now = new Date();

  if (user.lockUntil && user.lockUntil > now) {
    errorAuth.accountTemporarilyLocked();
  }

  if (user.lockUntil && user.lockUntil <= now) {
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
  }

  if (!user.isVerified) {
    errorUser.userNotVerified();
  }

  const match = await comparePassword(password, user.password);

  if (!match) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      errorAuth.accountTemporarilyLocked();
    }

    await user.save();
    errorAuth.passwordNotMatch();
  }



  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  // Generate token
  if(!user.twoFactorEnabled){
    const token = genrateToken({
    id: user.id,
    name: user.name,
  });
   return {
      requiresTwoFactor: false,
      token,
    };
  }


  const code=crypto.randomInt(100000,999999).toString();

  await otpRepository.deleteLoginOtp(user.email)

  await otpRepository.createLoginOtp(user.email, code);

  // Send OTP by email
  await mailjetProvider.sendmail(
    user.email,
    "Login Verification Code",
    `<h1>Your login verification code is: ${code}</h1>`
  );

  return {
    requiresTwoFactor: true,
    message: "Verification code sent to your email",
  };



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
   email: user.email,
  code,
});


  //send otp
 await mailjetProvider.sendmail(user.email, "Vervication code", `<h1>OTP CODE: ${code}</h1>`);
}


export async function resetPassword(email,code,newPasssword) {

  //check otp exist 
const otp= await otpRepository.getOtp(email)
if(!otp) {
  errorAuth.otpExpired()
}
  //check otp true
if(otp!==code){
  errorAuth.invalidOtp()
}
  //

  const hash_password=await hashPassword(newPasssword)

  await userRepository.updateUser(email,{password:hash_password})

await otpRepository.deleteOtp(email)
  
}




export async function loginGoogle(idToken) {
  const payload = await verfiyGoogle(idToken);

  console.log("Google email:", payload.email);

  const user = await authRepository.userExist(payload.email);

  console.log("User found:", user);

  if (user) {
    console.log("USER ALREADY EXISTS");

    return genrateToken({
      id: user._id,
      email: user.email
    });
  }

  console.log("USER NOT FOUND - CREATING");

  const createUser = await authRepository.createUser({
    name: payload.name,
    email: payload.email,
    provider: 'google',
    isVerified: true
  });

  return genrateToken({
    id: createUser._id,
    email: createUser.email
  });
}



export async function enableTwoFactor(userId) {
  const user = await userRepository.finduserById(userId);

  if (!user) {
    errorUser.userNotExist();
  }

  if (user.twoFactorEnabled) {
    throw new Error("Two-factor verification is already enabled");
  }

  if (!user.isVerified) {
    errorUser.userNotVerified();
  }

  const code = crypto.randomInt(100000, 1000000).toString();

  await otpRepository.createTwoFactorOtp(user.email, code);

  await mailjetProvider.sendmail(
    user.email,
    "Enable Two-Factor Verification",
    `<h1>Your verification code is: ${code}</h1>`
  );

  return { message: "Verification code sent successfully" };
}



export async function verifyEnableTwoFactor(userId, code) {

  const user=await userRepository.finduserById(userId)
if(!user){
    errorUser.userNotExist();

}
if(user.enableTwoFactor){
      throw new Error("Two-factor verification is already enabled");

}

const otp=await otpRepository.getTwoFactorOtp(user.email)

if(!otp){
    errorAuth.otpExpired();
}

if(otp!==code){
  errorAuth.invalidOtp()
}

await userRepository.updateUser(user.email,{
  twoFactorEnabled:true
})

  await otpRepository.deleteTwoFactorOtp(user.email);

    return { twoFactorEnabled: true };

}




export async function confirmLogin(email, password, code) {
  const user = await authRepository.userExist(email);

  if (!user) {
    errorUser.userNotExist();
  }

  if (!user.isVerified || !user.twoFactorEnabled) {
    errorAuth.invalidOtp();
  }

  // Verify password
  const match = await comparePassword(password, user.password);

  if (!match) {
    errorAuth.passwordNotMatch();
  }

  // Get OTP from Redis
  const otp = await otpRepository.getLoginOtp(user.email);

  if (!otp) {
    errorAuth.otpExpired();
  }

  // Compare OTP
  if (otp !== code) {
    errorAuth.invalidOtp();
  }

  // Delete OTP after successful verification
  await otpRepository.deleteLoginOtp(user.email);

  // Generate token
  return genrateToken({
    id: user.id,
    name: user.name,
  });
}



export async function testEmail() {

  await mailjetProvider.sendmail(
    "YOUR_EMAIL@gmail.com",
    "Test Email",
    "<h1>Hello from NGL App 🚀</h1>"
  );

}