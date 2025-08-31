import { catchAsync } from "../../utils/catchAsync";

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { serviceTangetion } from "./trenasactServis";
import { JwtPayload } from "jsonwebtoken";



const allTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
   

  const  data =await serviceTangetion.getall()

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.CREATED,
    message: "User created successfully",
    data: data.data


    

  })
});





const  myTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
       
  const userId = req.params.id;
  const result = await serviceTangetion.getmyprofile(userId)
  sendResponse(res, {
    success: true,
    statuscode: httpStatus.CREATED,
    message: "User created successfully",
    data: result,


    

  })
});





export const TransactionController = {
   allTransactions,
   myTransactions
}