export type TransactionType = "Deposit" | "Withdraw" | "Send" | "Cash-in" | "Cash-out";

export enum TransactionStatus {
  Pending = "Pending",
  Completed = "Completed",
  Reversed = "Reversed",
}

export interface ITransaction {
  type: TransactionType;
  amount: number;
  fee?: number;
  commission?: number;
  sender?: string;   // User ObjectId
  receiver?: string; // User ObjectId
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
