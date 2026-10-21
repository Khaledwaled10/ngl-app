import { cacheProvider } from "../../../lib/cache/init.js";
import { Otp } from "../model/otp.model.js";

export async function createOtp({ email, code }) {
  const key = `otp:${email}`;

  return await cacheProvider.set(key, code, 300);
}



export async function getOtp(email) {
  const key = `otp:${email}`;
  const otp = await cacheProvider.get(key);

  console.log("OTP exists:", otp !== null && otp !== undefined);
  console.log("OTP type:", typeof otp);

  return otp;
}



export async function deleteOtp(email) {
  const key = `otp:${email}`;

  return await cacheProvider.del(key);
}




export async function createTwoFactorOtp(email, code) {
  return await cacheProvider.set(`2fa:enable:${email}`, code, 300);
}

export async function getTwoFactorOtp(email) {
  return await cacheProvider.get(`2fa:enable:${email}`);
}

export async function deleteTwoFactorOtp(email) {
  return await cacheProvider.del(`2fa:enable:${email}`);
}





export async function createLoginOtp(email, code) {

return await cacheProvider.set(`2fa:login:${email}`,code,300)


}


export async function getLoginOtp(email) {
  return await cacheProvider.get(`2fa:login:${email}`);
}

export async function deleteLoginOtp(email) {
  return await cacheProvider.del(`2fa:login:${email}`);
}