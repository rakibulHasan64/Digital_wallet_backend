import { Schema, model, Types } from "mongoose";
import { IUser, Role, IsActive, IAuthProvider } from "./user.interface";

/** Auth Provider Schema */
const authProviderSchema = new Schema<IAuthProvider>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
});

/** User Schema */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String, required: false },
    picture: { type: String, required: false },
    address: { type: String, required: false },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    auths: [authProviderSchema], 
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const User = model<IUser>("User", userSchema);
