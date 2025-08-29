// src/modules/transaction/interface.ts
import { Document, Types } from "mongoose";

export type TransactionType =
  | "deposit"
  | "withdraw"
  | "send"
  | "cash-in"
  | "cash-out";

export type TransactionStatus = "pending" | "completed" | "reversed";

export interface ITransaction extends Document {
  type: TransactionType;
  amount: number;
  fee?: number;
  commission?: number;
  sender?: Types.ObjectId; // User or Agent who initiated
  receiver?: Types.ObjectId; // User or Agent who received
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
