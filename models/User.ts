// import mongoose, { Schema, Document } from 'mongoose';
// import { User } from '@/types';

// interface UserDocument extends Omit<User, '_id'>, Document {}

// const UserSchema = new Schema<UserDocument>({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   twilioNumber: { type: String, required: true, unique: true },
//   isActive: { type: Boolean, default: true },
//   aiSettings: {
//     greeting: {
//       type: String,
//       default: "Hello! Our team is currently busy, but I'm here to help. I'm your AI assistant."
//     },
//     questions: [{
//       type: String,
//       default: ["May I have your name?", "What's your phone number?", "Can you provide your email?", "What's your address?"]
//     }],
//     businessInfo: { type: String, default: "We're a professional service company." }
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
