
import { Wallet } from "../wallet/wallet.model";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

import bcryptjs from "bcryptjs"



const createUser = async (payload: Partial<IUser>) => {
  const { name, email, password, role, phone, picture, address } = payload;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const haspasword=await bcryptjs.hash(password as string, 10)
  console.log(haspasword, "user is being created");

   const authProvider: IAuthProvider={provider:"credentials",providerId: email as string}
  const user = new User({
    name,
    email,
    password: haspasword,
    auths: [authProvider],
    role: role || "USER",
    phone,
    picture,
    address,
  });

  // 2️⃣ Create Wallet
  const wallet = await Wallet.create({ user: user._id, balance: 50 }) 

   user.wallet = wallet._id;



  await user.save();

  return user;
};


const getAllUser = async () => {

  console.log("data is ");
  
  const users = await User.find({})
  return users
}

export const serviceUser = {
  createUser, getAllUser
}