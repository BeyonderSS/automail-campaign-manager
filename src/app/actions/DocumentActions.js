"use server";

import dbConnect from "@/lib/dbConnect";
import DocumentGallery from "@/models/DocumentGallery";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { utapi } from "./UTapi";

// Create a document
export async function createDocument({ title, url, fileKey, userId }) {
  await dbConnect();
  try {
    // Check if the user exists
    const user = await User.findOne({ "clerkUserId": userId });
    if (!user) {
      return { success: false, error: "User not found" };
    }
    const newDocument = await DocumentGallery.create({ 
      title, 
      url, 
      fileKey, 
      userId: user._id 
    });
    revalidatePath("/dashboard/document-gallary");
    return { success: true, data: JSON.parse(JSON.stringify(newDocument)) };
  } catch (error) {
    console.error("Error creating document:", error);
    return { success: false, error: error.message };
  }
}

// Read all documents for a user
export async function getDocumentsByUser(userId) {
  await dbConnect();
  try {
    const user = await User.findOne({ "clerkUserId": userId });
    if (!user) {
      return { success: false, error: "User not found" };
    }
    const documents = await DocumentGallery.find({ userId: user._id }).sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(documents)) };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { success: false, error: error.message };
  }
}

// Read a single document by ID
export async function getDocumentById(documentId) {
  await dbConnect();
  try {
    const document = await DocumentGallery.findById(documentId);
    if (!document) {
      return { success: false, error: "Document not found" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(document)) };
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    return { success: false, error: error.message };
  }
}

// Update a document
export async function updateDocument({ documentId, title, url, fileKey }) {
  await dbConnect();
  try {
    const updatedDocument = await DocumentGallery.findByIdAndUpdate(
      documentId,
      { title, url, fileKey },
      { new: true, runValidators: true } // Returns the updated document and applies validation
    );
    if (!updatedDocument) {
      return { success: false, error: "Document not found" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(updatedDocument)) };
  } catch (error) {
    console.error("Error updating document:", error);
    return { success: false, error: error.message };
  }
}

// Delete a document
export async function deleteDocument(documentId) {
    // Ensure database is connected
    await dbConnect();
  
    try {
      // Check if documentId is valid
      if (!documentId || typeof documentId !== "string") {
        return { success: false, error: "Invalid document ID provided" };
      }
  
      // Find the document to delete
      const document = await DocumentGallery.findById(documentId);
      if (!document) {
        return { success: false, error: "Document not found" };
      }
  
      // Attempt to delete the file from utapi
      try {
        await utapi.deleteFiles(document.fileKey);
      } catch (utapiError) {
        console.error("Error deleting file from utapi:", utapiError);
        return { 
          success: false, 
          error: "Document metadata deleted, but file deletion failed. Contact support for manual cleanup." 
        };
      }
  
      // Delete the document from the database
      const deletedDocument = await DocumentGallery.findByIdAndDelete(documentId);
      if (!deletedDocument) {
        return { success: false, error: "Failed to delete document. It may have already been deleted." };
      }
  revalidatePath("/dashboard/document-gallary")
      return { success: true, data: JSON.parse(JSON.stringify(deletedDocument)) };
    } catch (error) {
      console.error("Error deleting document:", error);
  
      // Handle specific database errors if needed
      if (error.name === "CastError" && error.kind === "ObjectId") {
        return { success: false, error: "Invalid document ID format" };
      }
  
      return { success: false, error: "An unexpected error occurred while deleting the document" };
    }
  }
  