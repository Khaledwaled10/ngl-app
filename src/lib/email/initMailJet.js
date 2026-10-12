import { MailjetProvider } from "../../pkj/mail/mailjet.js";

export const mailjetProvider=new MailjetProvider({
apiKey:process.env.MAILJET_API_KEY,
apiSecret:process.env.MAILJET_SECRET_KEY,
fromEmail:process.env.USER_SEND_EMAIL,
fromName:'NGL-APP'
})