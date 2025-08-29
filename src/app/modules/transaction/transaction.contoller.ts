import { catchAsync } from "../../utils/catchAsync";

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";



const allTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
   


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: {},


    

  })
});





const  myTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction)=> {

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.CREATED,
    message: "User created successfully",
    data: {},


    

  })
});





export const TransactionController = {
   allTransactions,
   myTransactions
}