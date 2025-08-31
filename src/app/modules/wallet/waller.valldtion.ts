// src/modules/wallet/validation.ts
import { z } from "zod";

/** Deposit / Withdraw / Send money */
export const walletTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  receiverId: z.string().optional(), 
});

/** Block / Unblock wallet */
export const walletStatusSchema = z.object({
  isBlocked: z.boolean(),
});

/** Infer Types */
export type WalletTransactionInput = z.infer<typeof walletTransactionSchema>;
export type WalletStatusInput = z.infer<typeof walletStatusSchema>;
