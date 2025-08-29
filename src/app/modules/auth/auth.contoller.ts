
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.servic";
import { setAuthcookie } from "../../utils/setcookies";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";






const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
  
  const login = await AuthService.credentialsLogin(res, req.body)
  setAuthcookie(res, login);

   sendResponse(res, {
       success: true,
       statuscode: httpStatus.OK,
       message: "User login successfully",
       data: login,
     });
});



const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const refreshToken = req.cookies.refreshToken
  
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Reres Tkeon")
  }

  const tokenInfo = await AuthService.getNewAccessToken(refreshToken)
  setAuthcookie(res, tokenInfo)
  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User login successfully",
    data: tokenInfo,
  });
});





const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })


  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })
  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User logout successfully",
    data: null,

  })
});
  
  
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const login = await AuthService.credentialsLogin(res, req.body)

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User login successfully",
    data: login,
  });
});






const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const login = await AuthService.credentialsLogin(res, req.body)

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User login successfully",
    data: login,
  });
});




const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const login = await AuthService.credentialsLogin(res, req.body)

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User login successfully",
    data: login,
  });
});


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword
  const decodeToken=req.user
  const newPasswords = await AuthService.resetPassword(oldPassword, newPassword, decodeToken as JwtPayload)



  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Password is reset successfully",
    data: newPasswords,
  });
});


export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword
  
}