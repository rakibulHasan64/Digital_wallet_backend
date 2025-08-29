// src/modules/wallet/wallet.model.ts
import { Schema, model, Types } from "mongoose";
import { IWallet } from "./wallet.interface";

const WalletSchema = new Schema<IWallet>(
  {
    // user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 50, min: 0 },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", WalletSchema);
