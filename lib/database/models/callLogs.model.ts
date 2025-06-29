import { Schema, model, Document } from "mongoose";

export interface ICallLog extends Document {
  userId: string;
  twilioNumber: string;
  callerNumber: string;
  callSid: string;
  direction: "inbound" | "outbound";
  status: "completed" | "busy" | "no-answer" | "failed" | "canceled";
  duration: number;
  startTime: Date;
  endTime?: Date;
  recordingUrl?: string;
  transcription?: string;
  handledBy: "user" | "ai" | "voicemail";
  leadGenerated: boolean;
  leadId?: string;
  cost: number;
}

const CallLogSchema = new Schema<ICallLog>({
  userId: { type: String, required: true, ref: "User" },
  twilioNumber: { type: String, required: true, ref: "TwilioNumber" },
  callerNumber: { type: String, required: true },
  callSid: { type: String, required: true, unique: true },
  direction: {
    type: String,
    required: true,
    enum: ["inbound", "outbound"],
  },
  status: {
    type: String,
    required: true,
    enum: ["completed", "busy", "no-answer", "failed", "canceled"],
  },
  duration: { type: Number, required: true, default: 0 },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  recordingUrl: { type: String },
  transcription: { type: String },
  handledBy: {
    type: String,
    required: true,
    enum: ["user", "ai", "voicemail"],
  },
  leadGenerated: { type: Boolean, required: true, default: false },
  leadId: { type: String, ref: "Lead" },
  cost: { type: Number, required: true, default: 0 },
});

// Add indexes for faster queries
CallLogSchema.index({ userId: 1 });
CallLogSchema.index({ twilioNumber: 1 });
CallLogSchema.index({ callerNumber: 1 });
CallLogSchema.index({ startTime: -1 });
CallLogSchema.index({ status: 1 });
CallLogSchema.index({ leadGenerated: 1 });

export const CallLog = model<ICallLog>("CallLog", CallLogSchema);
