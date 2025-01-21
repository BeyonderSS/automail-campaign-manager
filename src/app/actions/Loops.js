"use server";

import dbConnect from "@/lib/dbConnect";
import EmailQueue from "@/models/EmailQueue";
import Loop from '@/models/Loop';
import User from '@/models/User';
import { revalidatePath } from "next/cache";

export async function initializeLoop(userId, title, description) {
  try {
    await dbConnect();

    // Check if the user exists
    const user = await User.findOne({"clerkUserId":userId});
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Initialize a new loop
    const newLoop = new Loop({
      title,
      description,
      userId:user._id,
      status: 'pending', // Default status
      emails: [], // Start with an empty email queue
      sentEmails: 0,
      failedEmails: 0,
      totalEmails: 0, // This is optional and will be set later when emails are added
    });

    // Save the loop to the database
    await newLoop.save();

    return { success: true, data: JSON.parse(JSON.stringify(newLoop)), message: "Loop initialized successfully." };
  } catch (error) {
    console.error("Error initializing loop:", error);
    return { success: false, error: error.message };
  }
}
// eg email queue data 
// [
//     {
//       email: "user1@example.com",
//       dynamicFields: { firstName: "John", lastName: "Doe" },
//       subject: "Welcome to Our Service!",
//       body: "Hello {firstName} {lastName}, thank you for joining us.",
//       documentGallary: "document-gallery-id-1", // Replace with actual document gallery ID
//     },
//     {
//       email: "user2@example.com",
//       dynamicFields: { firstName: "Jane", lastName: "Smith" },
//       subject: "Your Subscription Details",
//       body: "Hello {firstName} {lastName}, here are your subscription details.",
//       documentGallary: "document-gallery-id-2", // Replace with actual document gallery ID
//     },
//   ];
export async function createEmailQueueForLoop(loopId, emailQueueData) {
    try {
      await dbConnect();

      // Find the loop by ID
      const loop = await Loop.findById(loopId);
      if (!loop) {
        return { success: false, error: "Loop not found" };
      }
      // Create email queue documents for each email in the provided data
      const emailQueues = await EmailQueue.insertMany(
        emailQueueData.map((emailData) => ({
          email: emailData.email,
          dynamicFields: emailData.dynamicFields,
          subject: emailData.subject,
          body: emailData.body,
          documentGallary: emailData.documentGallary,
        }))
      );
  
      // Add created email queue references to the loop
      loop.emails.push(...emailQueues.map((email) => email._id));
      loop.totalEmails = emailQueues.length; // Update totalEmails count
      await loop.save();
  
      return {
        success: true,
        data: JSON.parse(JSON.stringify(emailQueues)),
        message: "Email queues created and loop updated successfully.",
      };
    } catch (error) {
      console.error("Error creating email queue for loop:", error);
      return { success: false, error: error.message };
    }
  }

  export async function getAllLoopsByUserId(userId) {
    try {
      await dbConnect();
  
      // Find the user by their Clerk User ID
      const user = await User.findOne({ "clerkUserId": userId });
      if (!user) {
        return { success: false, error: "User not found" };
      }
  
      // Find all loops associated with the user
      const loops = await Loop.find({ userId: user._id });
  
      if (loops.length === 0) {
        return { success: true, data: [], message: "No loops found for the user." };
      }
  
      return { success: true, data: JSON.parse(JSON.stringify(loops)), message: "Loops retrieved successfully." };
    } catch (error) {
      console.error("Error retrieving loops:", error);
      return { success: false, error: error.message };
    }
  }
  
  export async function triggerLoop(loopId) {
    try {
      const response = await fetch(`${process.env.TRIGGER_URI}/api/loops/process-loop/${loopId}`, {
        method: "POST",
      });
  
      if (!response.ok) {
        // If response is not OK, get the error details
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process loop');
      }
  
      const responseData = await response.json();
      revalidatePath('/dashboard/your-loops/[slug]', 'page')
      revalidatePath('/dashboard/your-loops', 'page')
      return { success: true, message: responseData.message };
    } catch (error) {
      // Handle network errors or unexpected issues
      return { success: false, error: error.message || "An unexpected error occurred." };
    }
  }
  export async function getLoopById(userId, loopId) {
    try {
      await dbConnect();
  
      // Find the user by their Clerk User ID
      const user = await User.findOne({ "clerkUserId": userId });
      if (!user) {
        return { success: false, error: "User not found" };
      }
  
      // Find the loop by ID and associated with the user
      const loop = await Loop.findOne({ _id: loopId, userId: user._id });
      
      if (!loop) {
        return { success: false, error: "Loop not found" };
      }
  
      return { success: true, data: JSON.parse(JSON.stringify(loop)), message: "Loop retrieved successfully." };
    } catch (error) {
      console.error("Error retrieving loop:", error);
      return { success: false, error: error.message };
    }
  }
  