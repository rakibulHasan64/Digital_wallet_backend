import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { WalletServices } from "./wallet.service";


import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";


export const addMoney = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    const user = req.user as any

    

    const wallet = await WalletServices.addMoney(user.userId, amount);

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

  const amount = Number(req.body.amount);
  const user = req.user as any
  console.log("amout user book amndft..",amount,user);
  
  const wallet = await WalletServices.withdrawMoney(user.userId, amount);

  console.log("WALLATE IS NOT DEFIND....",wallet,user);
  
  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'withdrawManey Successfully',
    data: wallet
  });
})


// wallet.controller.ts
 const sendMany = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const { receiverId,amount } = req.body; 
   const user = req.user as any
   const result = await WalletServices.sendMany(user.userId, receiverId, Number(amount));

  sendResponse(res, {
    success: true,
    statuscode: httpStatus.OK,
    message: "Money sent successfully",
    data: result,
  });
});



const myTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const user = req.user as any
  const result = await WalletServices.myTransactions(user.userId)
   
  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: "Transactions fetched successfully",
    data: result
  });
})


const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const agentId = (req.user as any).userId 
  const {receiverId, amount } = req.body;

  const data = await WalletServices.cashIn(agentId,receiverId,amount)
  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: data
  });
})


const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const agentId = (req.user as any).userId
  const { senderId, amount } = req.body;

  const data = await WalletServices.cashOut(agentId, senderId, amount)
  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: data
  });
})


const allUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const allWalate = await WalletServices.allWalate()
  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data: allWalate
  });
})

const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;

  const blockWallet = await WalletServices.blockWallet(userId)
  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All block blockWallet',
    data: blockWallet
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