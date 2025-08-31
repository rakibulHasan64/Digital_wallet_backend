import { Schema, model, Types } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["Deposit", "Withdraw", "Send", "Cash-in", "Cash-out"] as TransactionType[],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    sender: { type: Types.ObjectId, ref: "User" },
    receiver: { type: Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.Pending,  // <-- TypeScript enum ব্যবহার
    },
  },
  { timestamps: true }
);

const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);
export default TransactionModel;



