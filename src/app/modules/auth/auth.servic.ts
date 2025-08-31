
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { createNewAccessTokenWithRefresToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

import { sendEmail } from "../../utils/sendEmail";




const getNewAccessToken = async (refreshToken: string) => {
   
   const newAccessToken =await createNewAccessTokenWithRefresToken(refreshToken)
   
   return {
      accessToken: newAccessToken
   }
};

const resetPassword = async (payload: Record<string,string>, decodeToken: JwtPayload) => {

   if (payload.id !=decodeToken.userId) {
      throw new AppError(401,"You can Not Rest Password")
   }


   const isUserExist=await User.findById(decodeToken.userId)
     

   if (!isUserExist) {
      throw new AppError(401, "You dees not exist")
   }
  

   const hashePassword = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))

   isUserExist.password = hashePassword;
   await isUserExist.save();

   


   
};



const setPassword = async (userId: string, PlainPassword: string,) => {
  

   const user = await User.findById(userId);
   if (!user) {
      throw new AppError(404, "User not found")
   }

   if (user.password && user.auths?.some(probidrobg=> probidrobg.provider==="google")) {
      throw new AppError(httpStatus.BAD_REQUEST, "you have alredy set you password. now you can change the password from your profile updaed")
   }

   const hashePassword = await bcryptjs.hash(
      PlainPassword,
      Number(envVars.BCRYPT_SALT_ROUND)
   )

   const credentialsProvider: IAuthProvider = {
      provider: "credentials",
      providerId: user.email
   }

   const auths: IAuthProvider[] = [...(user.auths || []), credentialsProvider]
   user.password = hashePassword
   user.auths = auths
   await user.save()
   


};



const forgotPassword = async(email: string,) => {
   const isUserExist = await User.findOne({ email })
   

   if (!isUserExist) throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
   if (!isUserExist.isVerified) throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
   if (isUserExist.status === IsActive.BLOCKED || isUserExist.status === IsActive.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, `User iS ${isUserExist.status}`)
   }
   if (isUserExist.isDeleted) throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")


   const JwtPayload = {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role
   }


   const reseToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, {
      expiresIn: "10m"
   })
    console.log("reseToken.........", reseToken);
    

   const resetUrl = `${envVars.FONTEND_URL}/reset-password?id=${isUserExist._id}&token=${reseToken}`
   
   sendEmail({
      to: isUserExist.email,
      subject: "Password Rest",
      templateName: "forgetPassword",
      templateData: {
         name: isUserExist.name,
         resetUrl
      }
   })
   

};






export const AuthService = {
   // credentialsLogin,
   getNewAccessToken,
   resetPassword,
   setPassword,
   forgotPassword
 
}