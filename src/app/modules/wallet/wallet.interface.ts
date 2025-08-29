// src/modules/wallet/interface.ts
import { Document, Types } from "mongoose";

export interface IWallet extends Document {
  user: Types.ObjectId; // reference to User
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
