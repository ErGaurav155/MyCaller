import { Types } from "mongoose";

export interface LeadType {
  _id: string;
  name?: string;
  phone: string;
  email?: string;
  address?: string;
  businessOwner: string;
  callSid: string;
  status: "pending" | "contacted" | "closed";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateUserType {
  clerkId: string;
  email: string;
  username?: string;
  phone?: string;
  twilioNumber?: string;
  isActive: boolean;
  plan: "free" | "starter" | "professional" | "enterprise";
  monthlyQuota: number;
  currentMonthUsage: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UpdateUserType {
  username?: string;
  phone?: string;
  twilioNumber?: string;
  isActive: boolean;
  plan: string;
  monthlyQuota: number;
  currentMonthUsage: number;
}

export interface CallSession {
  callSid: string;
  currentStep: number;
  collectedData: Partial<LeadType>;
  userId: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  callLimit: number;
  leadLimit: number;
}

export interface DashboardData {
  leads: LeadType[];
  user: CreateUserType | null;
  error?: string;
}
// export interface CreateUserParams {
//   clerkId: string;
//   email: string;
//   username: string | null;

//   firstName: string;
//   lastName: string;
//   photo: string;
// }

// export interface UpdateUserParams {
//   firstName: string;
//   lastName: string;
//   username: string | null;
//   photo: string;
// }
