"use server"

import dbConnect from "@/lib/dbConnect";
import User from '@/models/User';
export async function createUser(clerkUserId) {
  try {
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ clerkUserId });
    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Create a new user
    const newUser = new User({ clerkUserId });
    await newUser.save();

    return { success: true, data: JSON.parse(JSON.stringify(newUser)), message: "User created successfully." };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error.message };
  }
}
