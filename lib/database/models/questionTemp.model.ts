import { Schema, model, Document, models } from "mongoose";

// Separate interface for the question structure (without Document)
export interface Question {
  _id: string;
  question: string;
  order: number;
  required: boolean;
  type: "text" | "email" | "phone" | "number";
}

// Interface for the document that includes Mongoose properties

export interface IQuestionTemplate extends Document {
  userId: string;
  twilioNumber: string;
  greeting: string;
  questions: Question[]; // Use the basic Question interface here
  closingMessage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<Question>({
  _id: { type: String, required: true },
  question: { type: String, required: true },
  order: { type: Number, required: true },
  required: { type: Boolean, required: true },
  type: {
    type: String,
    required: true,
    enum: ["text", "email", "phone", "number"],
  },
});

const QuestionTemplateSchema = new Schema<IQuestionTemplate>({
  userId: { type: String, required: true },
  twilioNumber: { type: String, required: true },
  greeting: { type: String, required: true },
  questions: [QuestionSchema],
  closingMessage: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

QuestionTemplateSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const QuestionTemplate =
  models?.QuestionTemplate ||
  model<IQuestionTemplate>("QuestionTemplate", QuestionTemplateSchema);

export default QuestionTemplate;

export const defaultQuestions: Question[] = [
  {
    _id: "1",
    question: "May I please have your name?",
    order: 1,
    required: true,
    type: "text",
  },
  {
    _id: "2",
    question: "Could you please provide your email address?",
    order: 2,
    required: true,
    type: "email",
  },
  {
    _id: "3",
    question: "What is your budget range for this project?",
    order: 3,
    required: false,
    type: "text",
  },
  {
    _id: "4",
    question:
      "Could you please describe the problem or service you need help with?",
    order: 4,
    required: true,
    type: "text",
  },
];
