


import mongoose from "mongoose";
import { Wallet } from "./wallet.model";



interface Transaction {
  toUserId: string;
  amount: number;
}
const addMoney = async (userId: string, amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }


  const wallet = await Wallet.findOne({ user: new mongoose.Types.ObjectId(userId) });

  if (!wallet) {
    throw new Error("Wallet not found for this user");
  }

  wallet.balance += amount;
  await wallet.save();

  return wallet;
};



const withdrawMoney = async (userId: string, amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }


  const wallet = await Wallet.findOne({ user: new mongoose.Types.ObjectId(userId) });
 


  if (!wallet) {
    throw new Error("Wallet not found for this user");
  }

  wallet.balance -= amount;
  await wallet.save();

  return wallet;
};



const sendMany = async (senderId: string, transactions: Transaction[]) => {
  if (!Array.isArray(transactions)) {
    throw new Error("Transactions must be an array");
  }

  const senderWallet = await Wallet.findOne({ user: new mongoose.Types.ObjectId(senderId) });
  if (!senderWallet) throw new Error("Sender wallet not found");

  // Calculate total
  let totalAmount = 0;
  transactions.forEach(tx => totalAmount += tx.amount);

  if (senderWallet.balance < totalAmount) throw new Error("Insufficient balance");

  const results: any[] = [];

  for (const tx of transactions) {
    const receiverWallet = await Wallet.findOne({ user: new mongoose.Types.ObjectId(tx.toUserId) });

    if (!receiverWallet) {
      results.push({ toUserId: tx.toUserId, status: "failed", reason: "Receiver wallet not found" });
      continue;
    }

    // Update balances
    senderWallet.balance -= tx.amount;
    receiverWallet.balance += tx.amount;

    await receiverWallet.save();
    results.push({ toUserId: tx.toUserId, status: "success", amount: tx.amount });
  }

  // Save sender wallet after all deductions
  await senderWallet.save();

  return results;
};



export const WalletServices = {
  addMoney,
  withdrawMoney,
  sendMany,
};
