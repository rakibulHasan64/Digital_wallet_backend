// src/modules/transaction/model.ts
import { Schema, model, Types } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["deposit", "withdraw", "send", "cash-in", "cash-out"] as TransactionType[],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    sender: { type: Types.ObjectId, ref: "User" },
    receiver: { type: Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "completed", "reversed"] as TransactionStatus[],
      default: "pending",
    },
  },
  { timestamps: true }
);

const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);
export default TransactionModel;



