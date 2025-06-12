// export interface Lead {
//   _id: string;
//   name?: string;
//   phone: string;
//   email?: string;
//   address?: string;
//   businessOwner: string;
//   callSid: string;
//   status: "pending" | "contacted" | "closed";
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   twilioNumber: string;
//   isActive: boolean;
//   subscription?: {
//     plan: "starter" | "professional" | "enterprise";
//     status: "active" | "inactive" | "cancelled";
//     billingCycle: "monthly" | "yearly";
//     startDate: Date;
//     endDate: Date;
//     paymentMethod: "razorpay" | "paypal";
//   };
//   aiSettings: {
//     greeting: string;
//     questions: string[];
//     businessInfo: string;
//   };
//   createdAt: Date;
// }

// export interface CallSession {
//   callSid: string;
//   currentStep: number;
//   collectedData: Partial<Lead>;
//   userId: string;
// }

// export interface PricingPlan {
//   id: string;
//   name: string;
//   description: string;
//   monthlyPrice: number;
//   yearlyPrice: number;
//   features: string[];
//   popular?: boolean;
//   callLimit: number;
//   leadLimit: number;
// }
export interface CreateUserParams {
  clerkId: string;
  email: string;
  username: string | null;

  firstName: string;
  lastName: string;
  photo: string;
}

export interface UpdateUserParams {
  firstName: string;
  lastName: string;
  username: string | null;
  photo: string;
}
