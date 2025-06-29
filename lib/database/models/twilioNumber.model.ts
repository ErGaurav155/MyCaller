import { Schema, model, Document } from "mongoose";

export interface ITwilioNumber extends Document {
  userId: string;
  phoneNumber: string;
  friendlyName: string;
  isActive: boolean;
  forwardToNumber: string;
  aiAssistantEnabled: boolean;
  voiceUrl: string;
  statusCallbackUrl: string;
  createdAt: Date;
  totalCalls: number;
  totalLeads: number;
  monthlyQuota: number;
  currentMonthUsage: number;
}

const TwilioNumberSchema = new Schema<ITwilioNumber>({
  userId: { type: String, required: true, ref: "User" },
  phoneNumber: { type: String, required: true, unique: true },
  friendlyName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  forwardToNumber: { type: String, required: true },
  aiAssistantEnabled: { type: Boolean, default: false },
  voiceUrl: { type: String, required: true },
  statusCallbackUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  totalCalls: { type: Number, default: 0 },
  totalLeads: { type: Number, default: 0 },
  monthlyQuota: { type: Number, required: true },
  currentMonthUsage: { type: Number, default: 0 },
});

export const TwilioNumber = model<ITwilioNumber>(
  "TwilioNumber",
  TwilioNumberSchema
);
