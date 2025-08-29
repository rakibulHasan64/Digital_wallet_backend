// src/modules/transaction/validation.ts
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["deposit", "withdraw", "send", "cash-in", "cash-out"]),
  amount: z.number().positive(),
  receiverId: z.string().optional(),
  senderId: z.string().optional(),
});
export type TransactionInput = z.infer<typeof transactionSchema>;
