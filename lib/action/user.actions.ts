"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { UpdateUserType, CreateUserType } from "@/types/index";
import QuestionTemplate from "../database/models/questionTemp.model";
import UserStats from "../database/models/userStats.model";
import Lead from "../database/models/lead.model";

// CREATE
export async function createUser(user: CreateUserType) {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
  revalidateTag("users");
}
export async function getUserByDbId(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ _id: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
  revalidateTag("users");
}
export async function updateNumberByDbId(buyerId: string, newNumber: string) {
  try {
    await connectToDatabase();

    const user = await User.findOneAndUpdate(
      { _id: buyerId },
      { $set: { phone: newNumber } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }

  revalidateTag("users");
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserType) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// lib/actions/user.actions.ts
export async function updateCredits(userDbId: string, creditFee: number) {
  try {
    await connectToDatabase();

    // Prevent negative credits
    if (creditFee < 0) {
      const user = await User.findById(userDbId);
      if (user.creditBalance + creditFee < 0) {
        throw new Error("Insufficient credits");
      }
    }

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userDbId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );

    if (!updatedUserCredits) throw new Error("User credits update failed");
    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}
// export async function seedDatabase() {
//   try {
//     await connectToDatabase();

//     // Clear existing data

//     // Insert dummy templates
//     for (const template of dummyLeads) {
//       const newTemplate = new Lead(template);
//       await newTemplate.save();
//       console.log(`Created template for user: ${template.userId}`);
//     }

//     console.log("Database seeded successfully!");
//     process.exit(0);
//   } catch (error) {
//     console.error("Seeding failed:", error);
//     process.exit(1);
//   }
// }
