"use server";
import Plan from "@/lib/database/models/plan.model";
import { connectToDatabase } from "@/lib/database/mongoose";

const plans = [
  {
    productId: "starter",
    name: "Starter Plan",
    amount: 100,
    currency: "INR",
    period: "monthly",
  },
  {
    productId: "professional",
    name: "Professional Plan",
    amount: 100,
    currency: "INR",
    period: "monthly",
  },
  {
    productId: "enterprise",
    name: "Enterprise Plan",
    amount: 100,
    currency: "INR",
    period: "monthly",
  },
];
// export async function seedPlans() {
//   try {
//     await connectToDatabase();
//     console.log("Connected to database");

//     for (const planData of plans) {
//       const existingPlan = await Plan.findOne({
//         productId: planData.productId,
//       });

//       if (existingPlan) {
//         console.log(`Plan ${planData.productId} already exists. Updating...`);
//         await Plan.updateOne({
//           productId: planData.productId,
//           razorpaymonthlyplanId: "hi",
//           paypalmonthlyplanId: "hello",
//           razorpayyearlyplanId: "how",
//           paypalyearlyplanId: "you",
//         });
//       } else {
//         console.log(`Creating plan ${planData.productId}...`);
//         await Plan.create(planData);
//       }
//     }

//     console.log("✅ Plans seeded successfully");
//   } catch (error) {
//     console.error("❌ Error seeding plans:", error);
//   }
// }
export const getRazerpayPlanInfo = async (productId: string) => {
  try {
    await connectToDatabase(); // Ensure database connection

    const plan = await Plan.findOne({ productId });
    if (!plan) {
      throw new Error(`Plan with productId ${productId} not found.`);
    }
    return JSON.parse(JSON.stringify(plan));
  } catch (error: any) {
    console.error("Error retrieving plan info:", error.message);
    throw new Error("Failed to retrieve plan info.");
  }
};
