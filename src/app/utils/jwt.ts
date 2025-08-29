

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import AppError from "../errorHelpers/AppError";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions)

    return token
}

export const verifyToken = (token: string, secret: string): JwtPayload => {
    try {
        const verifiedToken = jwt.verify(token, secret);

        if (typeof verifiedToken === "string") {
            throw new AppError(400, "Invalid token format");
        }

        return verifiedToken as JwtPayload;
    } catch (error) {
        throw new AppError(401, "Invalid or expired token");
    }
};