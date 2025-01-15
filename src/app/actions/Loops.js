"use server";

import dbConnect from "@/lib/dbConnect";
import EmailQueue from "@/models/EmailQueue";
import Loop from '@/models/Loop';
import User from '@/models/User';

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
          status: "pending", // Default status
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