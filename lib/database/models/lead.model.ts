import { Schema, model, Document } from "mongoose";

export interface ILead extends Document {
  userId: string;
  twilioNumber: string;
  callerNumber: string;
  name: string;
  email: string;
  address: string;
  budget: string;
  problem: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: Date;
  resolvedAt?: Date;
  notes?: string;
  source: "ai-call" | "manual";
  callDuration?: number;
  recordingUrl?: string;
}

const LeadSchema = new Schema<ILead>({
  userId: { type: String, required: true, ref: "User" },
  twilioNumber: { type: String, required: true, ref: "TwilioNumber" },
  callerNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  budget: { type: String, required: true },
  problem: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "resolved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  notes: { type: String },
  source: {
    type: String,
    required: true,
    enum: ["ai-call", "manual"],
  },
  callDuration: { type: Number },
  recordingUrl: { type: String },
});

LeadSchema.index({ userId: 1 });
LeadSchema.index({ twilioNumber: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });

export const Lead = model<ILead>("Lead", LeadSchema);
