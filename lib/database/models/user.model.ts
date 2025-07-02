import { Schema, model, Document, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  phone: string;
  createdAt: Date;
  plan: "free" | "starter" | "professional" | "enterprise";
  isActive: boolean;
  twilioNumber: string;
  monthlyQuota: number;
  currentMonthUsage: number;
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  username: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  plan: {
    type: String,
    default: "free",
    enum: ["free", "starter", "professional", "enterprise"],
  },
  isActive: { type: Boolean, default: false },
  twilioNumber: { type: String },
  monthlyQuota: { type: Number, default: 0, required: true },
  currentMonthUsage: { type: Number, default: 0, required: true },
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
