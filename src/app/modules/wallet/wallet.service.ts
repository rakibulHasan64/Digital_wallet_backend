


import mongoose from "mongoose";

import TransactionModel from "../transaction/transaction.model";
import { TransactionStatus } from "../transaction/transaction.interface";
import { IUser } from "../user/user.interface";
import { Wallet } from "./wallet.model";



interface Transaction {
  toUserId: string;
  amount: number;
}
const addMoney = async (userId: string, amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const session = await mongoose.startSession();
  session.startTransaction()
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { user: userId, isBlocked: false }, { $inc: { balance: amount } },
      { new: true, session }
    );

    if (!wallet) {
      throw new Error("Wallet not found for this user");
    }

    await TransactionModel.create(
      [
        {
          type: "Deposit",
          amount,
          sender: userId,
          receiver: userId,
          status: TransactionStatus.Completed
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return wallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};



const withdrawMoney = async (userId: string, amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const session = await mongoose.startSession()
  session.startTransaction();
 
  try {
     
    const wallets = await Wallet.findOne({ user: userId, }).session(session);
    if (!wallets) throw new Error("Wallet not found or blocked");
    if (wallets.balance < amount) throw new Error("Insufficient balance");

    wallets.balance -= amount
    await wallets.save({ session })
    
    await TransactionModel.create([
      {
        type: "Withdraw",
        amount,
        sender: userId,
        receiver: userId,
        status: TransactionStatus.Completed
      }
    ], { session })


    await session.commitTransaction();
    session.endSession();

    return wallets;
    
   } catch (error) {
     await session.abortTransaction();
     session.endSession();
     throw error;
   }

  
};



const sendMany = async (userId: string ,receiverId: string, amount: number) => {
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  const session = await mongoose.startSession();
  session.startTransaction();


  try {
    const senderWallet = await Wallet.findOne({ user: userId, isBlocked: false }).session(session)
  
    const receiverWallet = await Wallet.findOne({ user: receiverId, isBlocked: false }).session(session)
  
    if (!senderWallet || !receiverWallet) throw new Error("Wallet not found or blocked");
    if (senderWallet.balance < amount) throw new Error("Insufficient balance");


    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    await TransactionModel.create([{
      type: "Send",
      amount,
      sender: userId,
      receiver: receiverId,
      status: TransactionStatus.Completed
    }], { session })

    await session.commitTransaction()
    session.endSession();
    return {
      senderWallet,
      receiverWallet
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession();
    throw error
  }

  

};



const myTransactions = async (userId: string, ) => {


  return  TransactionModel.find({
    $or: [{ sender: userId }, { receiver: userId }]
  }).sort({ createdAt: -1 });
}
   

const cashIn = async (agentId:string, receiverId: string, amount: number) => {

  if (!amount || amount <= 0) throw new Error("Invalid amount");

  const senderWallet = await Wallet.findOne({ user: agentId })
  const receiverWallet = await Wallet.findOne({ user: receiverId });

  if (!senderWallet) throw new Error("Agent wallet not found");
  if (!receiverWallet) throw new Error("Receiver wallet not found");
  if (senderWallet.balance < amount) throw new Error("Insufficient balance in agent wallet");

  senderWallet.balance -= amount
  receiverWallet.balance += amount


  await senderWallet.save();
  await receiverWallet.save();

  await TransactionModel.create({
    type: "cash-in",
    amount,
    sender: agentId,
    receiver: receiverId,
    status: "completed"
  });

  return { senderWallet, receiverWallet };
} 
   

const cashOut = async (agentId: string, senderId: string, amount: number) => {

  if (!amount || amount <= 0) throw new Error("Invalid amount");
     
  
  const senderWallet = await Wallet.findOne({ user: agentId })
  const receiverWallet = await Wallet.findOne({ user: senderId });



  if (!senderWallet) throw new Error("Sender wallet not found");
  if (!receiverWallet) throw new Error("Agent wallet not found");
  if (senderWallet.balance < amount) throw new Error("Insufficient balance in user wallet");


  senderWallet.balance -= amount
  receiverWallet.balance += amount

  await senderWallet.save();
  await receiverWallet.save();


  await TransactionModel.create({
    type: "cash-out", 
    amount,
    sender: senderId,
    receiver: agentId,
    status: "completed"
  });


  return { senderWallet, receiverWallet };

}





const allWalate = async () => {
  return Wallet.find() 
}




const blockWallet = async (userId: string) => {

  const blockWallets = await Wallet.findById(userId)
  if (!blockWallets) throw new Error("Wallet not found");

  blockWallets.isBlocked = !blockWallets.isBlocked;

  await blockWallets.save();
 

}



export const WalletServices = {
  addMoney,
  withdrawMoney,
  sendMany,
  myTransactions,
  cashOut,
  cashIn,
  allWalate,
  blockWallet
};
