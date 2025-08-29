

import { NextFunction, Request, Response,   } from "express";
import { JwtPayload } from "jsonwebtoken";

import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { IsActive } from "../modules/user/user.interface";



export const checkAuth = (...authRoles: string[]) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Header বা Cookie থেকে টোকেন বের করা
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;

    let accessToken: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1]; // Bearer টোকেন থেকে টোকেন অংশ বের করা
    } else if (cookieToken) {
      accessToken = cookieToken;
    }

    if (!accessToken) {
      throw new AppError(403, "No token received");
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    const isUserExist = await User.findOne({ email: verifiedToken.email });
    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }

    if (!isUserExist.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
    }

    if (isUserExist.status === IsActive.BLOCKED || isUserExist.status === IsActive.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}`);
    }

    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
    }

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(403, "You are not permitted to access this route");
    }

    req.user = verifiedToken;
    next();
  } catch (error) {
    next(error);
  }
};
