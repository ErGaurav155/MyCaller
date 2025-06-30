import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  phone: string;
  whatsappNumber: string;
  createdAt: Date;
  plan: "free" | "starter" | "professional" | "enterprise";
  isActive: boolean;
  twilioNumber: string;
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
  whatsappNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  plan: {
    type: String,
    default: "free",
    enum: ["free", "starter", "professional", "enterprise"],
  },
  isActive: { type: Boolean, default: false },
  twilioNumber: {
    type: String,
  },
});

export const User = model<IUser>("User", UserSchema);

export interface IUserStats extends Document {
  userId: string;
  totalCalls: number;
  totalLeads: number;
  monthlyStats: {
    month: string;
    year: number;
    calls: number;
    leads: number;
  }[];
  conversionRate: number;
}

const UserStatsSchema = new Schema<IUserStats>({
  userId: { type: String, required: true, ref: "User" },
  totalCalls: { type: Number, default: 0 },
  totalLeads: { type: Number, default: 0 },
  monthlyStats: [
    {
      month: String,
      year: Number,
      calls: Number,
      leads: Number,
    },
  ],
  conversionRate: { type: Number, default: 0 },
});

export const UserStats = model<IUserStats>("UserStats", UserStatsSchema);
