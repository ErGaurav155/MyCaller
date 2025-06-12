import mongoose, { Schema, Document } from "mongoose";
import { Lead } from "@/types";

interface LeadDocument extends Omit<Lead, "_id">, Document {}

const LeadSchema = new Schema<LeadDocument>(
  {
    name: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    businessOwner: {
      type: Schema.Types.ObjectId,
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

export default mongoose.models.Lead ||
  mongoose.model<LeadDocument>("Lead", LeadSchema);
