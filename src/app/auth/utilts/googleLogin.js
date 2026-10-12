import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../../pkj/error/appError.js";

const client = new OAuth2Client();

export async function verfiyGoogle(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    return ticket.getPayload();

  } catch (error) {
    console.log("========== GOOGLE VERIFY ERROR ==========");
    console.log("message:", error.message);
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("=========================================");

    throw new AppError("invalid google token", 403);
  }
}