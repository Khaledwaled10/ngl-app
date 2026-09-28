import nodemailer from "nodemailer";

const sendEmailProcess = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_SEND_EMAIL,
    pass: process.env.PASSWORD_SEND_EMAIL,
  },
});

export async function sendEmail(to, subject, html) {
  try {

    const info = await sendEmailProcess.sendMail({
      from: `"Example Team" <${process.env.USER_SEND_EMAIL}>`,
      to,
      subject,
      html,
    });


    return info;
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    throw err;
  }
}