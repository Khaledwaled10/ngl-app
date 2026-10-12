import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import crypto from "crypto";
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
  if (otp !== code) {
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






export async function testEmail() {

  await mailjetProvider.sendmail(
    "YOUR_EMAIL@gmail.com",
    "Test Email",
    "<h1>Hello from NGL App 🚀</h1>"
  );

}