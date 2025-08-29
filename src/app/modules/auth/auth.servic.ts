
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus, { INSUFFICIENT_SPACE_ON_RESOURCE } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { Response } from "express";
import { createNewAccessTokenWithRefresToken, createUserTokens } from "../../utils/userToken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (res: Response,payload: Partial<IUser>) => {

   const { email, password } = payload;
   if (!email || !password) {
      throw new AppError(httpStatus.BAD_REQUEST, "Email and password are required");
   }

      const isUserExist=await User.findOne({email})
      
   if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST,"Email does not exist")
         
   }


   const isasswordMacth = await bcryptjs.compare(password as string, isUserExist.password as string)

   

   if (!isasswordMacth) {
      throw new AppError(httpStatus.BAD_REQUEST,"Passeword no mach")
   }

   const userTokens = createUserTokens(isUserExist)
   const { password: pass, ...rest } = isUserExist.toObject()
   return {
      accessToken: userTokens.accessToken,
      refreshToken: userTokens.refreshToken,
      user: rest
   }

   
}


const getNewAccessToken = async (refreshToken: string) => {
   
   const newAccessToken =await createNewAccessTokenWithRefresToken(refreshToken)
   
   return {
      accessToken: newAccessToken
   }
};

const resetPassword = async (oldPassword: string, newPassword: string, decodeToken: JwtPayload) => {

   const user=await User.findById(decodeToken.userId)

   const isOldPasswordMacth=await bcryptjs.compare(oldPassword, user!.password as string)

   if (isOldPasswordMacth) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Passeword no mach")
   }

   user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
   user!.save();

   
};



export const AuthService = {
   credentialsLogin,
   getNewAccessToken,
   resetPassword
 
}