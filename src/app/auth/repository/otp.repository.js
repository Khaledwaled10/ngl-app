import { cacheProvider } from "../../../lib/cache/init.js";
import { Otp } from "../model/otp.model.js";

export async function createOtp({ email, code }) {
  const key = `otp:${email}`;

  return await cacheProvider.set(key, code, 300);
}

export async function getOtp(email) {
  const key = `otp:${email}`;

  return await cacheProvider.get(key);
}

export async function deleteOtp(email) {
  const key = `otp:${email}`;

  return await cacheProvider.del(key);
}