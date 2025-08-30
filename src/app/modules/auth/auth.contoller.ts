
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response, urlencoded } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.servic";
import { setAuthcookie } from "../../utils/setcookies";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userToken";
import { envVars } from "../../config/env";
import passport from "passport";






const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
  
  // const login = await AuthService.credentialsLogin(res, req.body)


  passport.authenticate("local", async (err: any, user: any, info: any) => {
    


    if (err) {
       
      return next(err)
    }

    if (!user) {
      return next(new AppError(401, info.message))
    }


    const userTokens = await createUserTokens(user)
    

     const {password, ...rest}=user.toObject()

    
    setAuthcookie(res, userTokens);

    sendResponse(res, {
      success: true,
      statuscode: httpStatus.OK,
      message: "User login successfully",
      data: {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
      },
    });



  })(req,res, next);

  
})


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



  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User login successfully",
    data: null
  });
});

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const decodedToken = req.user as JwtPayload
  const { password } = req.body;

 await AuthService.setPassword(decodedToken.userId,password)

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "User login successfully",
    data: null,
  });
});




const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const { email } = req.body;


  

  await AuthService.forgotPassword(email)

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Email sent successfully",
    data: null,
  });
});


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

 
  const decodeToken=req.user
  const newPasswords = await AuthService.resetPassword(req.body, decodeToken as JwtPayload)



  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Password is reset successfully",
    data: newPasswords,
  });
});



const googleCallBackConttoler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  

  let redirectTo = req.query.state ? req.query.state as string : ""
  if (redirectTo.startsWith("/")) {
    redirectTo=redirectTo.slice(1)
    
  }
  const user = req.user;
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  const tokenInfo = createUserTokens(user)
  setAuthcookie(res,tokenInfo)

  const frontendURL = envVars.FONTEND_URL.replace(/\/+$/, ""); // remove trailing slash
  res.redirect(`${frontendURL}/${redirectTo}`);

});

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
  googleCallBackConttoler
  
}



