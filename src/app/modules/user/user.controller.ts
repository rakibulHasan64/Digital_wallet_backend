/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { serviceUser } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';


export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await serviceUser.createUser(req.body);
  sendResponse(res, {
    success: true,
    statuscode: 201,
    message: 'User Created Successfully!',
    data: user,
  });
})


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await serviceUser.getAllUser();

  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data:result
  });
})


const updateUserByAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  

  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data:{}
  });


})

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  

  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data:{}
  });

  
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  

  sendResponse(res, {
    success: true,
    statuscode: StatusCodes.OK,
    message: 'All Users Retrieved Successfully',
    data:{}
  });

  
})

export const userController = {
  createUser,
  getAllUsers,
  updateUserByAdmin,
  updateMyProfile,
  getMyProfile,
};
