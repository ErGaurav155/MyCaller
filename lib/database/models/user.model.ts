import { Schema, model, models, Document } from "mongoose";
import type { CreateUserType } from "@/types";

interface UserDocument extends Omit<CreateUserType, "_id">, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    phone: {
      type: String,
    },
    twilioNumber: {
      type: String,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    aiSettings: {
      type: {
        greeting: {
          type: String,
          default:
            "Hello! Our team is currently busy, but I'm here to help. I'm your AI assistant.",
        },
        questions: {
          type: [String],
          default: [
            "May I have your name?",
            "What's your phone number?",
            "Can you provide your email?",
            "What's your address?",
          ],
        },
        businessInfo: {
          type: String,
          default: "We're a professional service company.",
        },
      },
      required: true,
      default: {
        greeting:
          "Hello! Our team is currently busy, but I'm here to help. I'm your AI assistant.",

        questions: [
          "May I have your name?",
          "What's your phone number?",
          "Can you provide your email?",
          "What's your address?",
        ],
        businessInfo: "We're a professional service company.",
      },
    },

    photo: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const User = models?.User || model<UserDocument>("User", UserSchema);

export default User;
