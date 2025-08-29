import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { WalletServices } from "./wallet.service";


import httpStatus from "http-status-codes";


export const addMoney = async (req: Request, res: Response, next: NextFunction) => {
  try {

  

    
    const { amount } = req.body;
    const userId = req.user?.userId; 

    const wallet = await WalletServices.addMoney(userId, amount);

    sendResponse(res, {
      success: true,
      statuscode: StatusCodes.OK,
      message: "Money Added Successfully",
      data: wallet,
    });
  } catch (err: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};


const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const { amount } = req.body;
  const userId = req.user?.userId; 

  const wallet = await WalletServices.withdrawMoney(userId, amount);
  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: wallet
  });
})


// wallet.controller.ts
 const sendMany = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const senderId = req.user?.userId;
  const { transactions } = req.body; 

  const result = await WalletServices.sendMany(senderId, transactions);

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Money sent to many users successfully",
    data: result,
  });
});



const myTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: {}
  });
})


const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: {}
  });
})


const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: {}
  });
})


const allUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: {}
  });
})

const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: {}
  });
})



export const WalletController = {
  addMoney,
  withdrawMoney,
  sendMany,
  myTransactions,
  cashIn,
  cashOut,
  allUsers,
  blockWallet


}