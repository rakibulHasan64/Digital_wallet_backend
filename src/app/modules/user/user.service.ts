
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

import bcryptjs from "bcryptjs"




const createUser = async (payload: Partial<IUser>) => {
  const { name, email, password, role, phone, picture, address } = payload;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authProvider = { provider: "credentials", providerId: email as string };

    // 1️⃣ Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      auths: [authProvider],
      role: role || "USER",
      phone,
      picture,
      address,
    });

    // 2️⃣ Create Wallet
    const wallet = await Wallet.create([{ user: user._id, balance: 50 }], { session });
    user.wallet = wallet[0]._id;

    // 3️⃣ Save user
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllUser = async () => {

  console.log("data is ");
  
  const users = await User.find({})
  return users
}


const getSingle = async (userId: string) => {


  const users = await User.findById(userId).select("-password")
  return {
    data: users
  }
}



const getMyProfile = async (userId: string) => {



  const users = await User.findById(userId).select("-password")
  return {
    data: users
  } 
}




export const serviceUser = {
  createUser,
  getAllUser,
  getMyProfile,
  getSingle
}