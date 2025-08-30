
import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import ejs from "ejs"
import path from "path"
import AppError from "../errorHelpers/AppError"

const transpoter = nodemailer.createTransport({

   host: envVars.EMAIL_SENDER.SMTP_HOST,
   port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
   secure: true,
   auth: {
      user: envVars.EMAIL_SENDER.SMTP_USER,
      pass: envVars.EMAIL_SENDER.SMTP_PASS
   }


})






interface sendEmailOptions {
   to: string;
   subject: string;
   templateName: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   templateData?: Record<string, any>;
   attachments?: {
      filename: string,
      content: string,
      contentType: string
   }[]
}



export const sendEmail = async ({
   to,
   subject,
   templateName,
   templateData,
   attachments
}: sendEmailOptions) => {

   try {
      const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
      const html=await ejs.renderFile(templatePath,templateData)
      const info = await transpoter.sendMail({
         from: envVars.EMAIL_SENDER.SMTP_FROM,
         to: to,
         subject: subject,
         html: html,
         attachments: attachments?.map(attachment => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType
         }))
      })
   } catch (error: any) {
      console.log("email sending error ", error.mesaage);
      throw new AppError(401, "email error")
      
   }
}