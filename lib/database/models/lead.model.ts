import mongoose, { Schema, Document } from "mongoose";
import { LeadType } from "@/types";

interface LeadDocument extends Omit<LeadType, "_id">, Document {}

const LeadSchema = new Schema<LeadDocument>(
  {
    name: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    businessOwner: {
      type: String,
      ref: "User",
      required: true,
    },
    callSid: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Lead =
  mongoose.models?.Lead || mongoose.model<LeadDocument>("Lead", LeadSchema);

export default Lead;
