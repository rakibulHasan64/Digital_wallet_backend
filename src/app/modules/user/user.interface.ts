import { Document, Types } from "mongoose";

/** =========================
 * User Roles Enum
 * ========================= */
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

/** =========================
 * Status Enum
 * ========================= */
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

/** =========================
 * Auth Provider Interface
 * ========================= */
export interface IAuthProvider {
  provider: string;   // "google" | "email"
  providerId: string;
}


/** =========================
 * User Interface
 * ========================= */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;                  // enum
  status: IsActive;            // enum
   wallet?: Types.ObjectId;     // reference to Wallet
  phone?: string;              // optional
  picture?: string;            // optional
  address?: string;            // optional
  isVerified: boolean;         // email/phone verified?
  isDeleted: boolean;          // soft delete flag
  authProviders?: IAuthProvider[]; // multiple auth providers
  createdAt: Date;
  updatedAt: Date;
}

