import { Schema, model, Document, models } from "mongoose";

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

const UserStats =
  models?.UserStats || model<IUserStats>("UserStats", UserStatsSchema);

export default UserStats;
