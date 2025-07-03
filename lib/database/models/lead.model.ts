import { Schema, model, Document, models } from "mongoose";

export interface QuestionnaireItem {
  question: string;
  answer: string;
  type: "name" | "email" | "phone" | "address" | "budget" | "problem";
  required: boolean;
}

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
  questionnaire: QuestionnaireItem[]; // New field
}

const QuestionnaireSchema = new Schema<QuestionnaireItem>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["name", "email", "phone", "address", "budget", "problem"],
  },
  required: { type: Boolean, required: true },
});

const LeadSchema = new Schema<ILead>({
  userId: { type: String, required: true, ref: "User" },
  twilioNumber: { type: String, required: true },
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
  questionnaire: [QuestionnaireSchema], // New field
});

const Lead = models?.Lead || model<ILead>("Lead", LeadSchema);

export default Lead;
