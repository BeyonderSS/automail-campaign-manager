"use server"
import { clerkClient } from '@clerk/nextjs/server';

/**
 * Function to add or update private metadata for a user on Clerk
 * @param {string} userId - Clerk User ID
 * @param {object} metadata - Key-value pairs of metadata to add or update
 */
export async function updateUserMetadata(userId, metadata) {
  try {
    const client = await clerkClient();

    // Check if metadata is empty
    if (!metadata || Object.keys(metadata).length === 0) {
      return { success: false, error: "No metadata provided." };
    }

    // Update the private metadata on Clerk
    await client.users.updateUserMetadata(userId, {
      privateMetadata: metadata,
    });

    return { success: true, message: "Metadata updated successfully." };
  } catch (error) {
    console.error("Error updating metadata:", error);
    return { success: false, error: "Failed to update metadata." };
  }
}

/**
 * Function to add or update SMTP mail in private metadata
 * @param {string} userId - Clerk User ID
 * @param {string} smtpMail - SMTP mail value
 */
export async function updateSmtpMail(userId, smtpMail) {
  return updateUserMetadata(userId, { smtpMail });
}

/**
 * Function to add or update SMTP password in private metadata
 * @param {string} userId - Clerk User ID
 * @param {string} smtpPassword - SMTP password value
 */
export async function updateSmtpPassword(userId, smtpPassword) {
  return updateUserMetadata(userId, { smtpPassword });
}

/**
 * Function to add or update Huggingface token in private metadata
 * @param {string} userId - Clerk User ID
 * @param {string} huggingfaceToken - Huggingface token value
 */
export async function updateHuggingfaceToken(userId, huggingfaceToken) {
  return updateUserMetadata(userId, { huggingfaceToken });
}

/**
 * Function to update multiple fields at once
 * @param {string} userId - Clerk User ID
 * @param {object} credentials - The credentials object containing key-value pairs for metadata fields
 */
export async function updateCredentials(userId, credentials) {
  try {
    const metadata = {};

    // Conditionally add metadata fields if they exist in the credentials object
    if (credentials.smtpMail) metadata.smtpMail = credentials.smtpMail;
    if (credentials.smtpPassword) metadata.smtpPassword = credentials.smtpPassword;
    if (credentials.huggingfaceToken) metadata.huggingfaceToken = credentials.huggingfaceToken;

    if (Object.keys(metadata).length === 0) {
      return { success: false, error: "No valid credentials provided." };
    }

    // Update all provided metadata fields
    return updateUserMetadata(userId, metadata);
  } catch (error) {
    console.error("Error updating credentials:", error);
    return { success: false, error: "Failed to update credentials." };
  }
}

/**
 * Function to fetch private metadata for a user from Clerk.
 * @param {string} userId - The Clerk User ID.
 * @returns {object} - An object containing the metadata fields.
 */
export async function getUserMetadata(userId) {
  try {
    const client = await clerkClient()

    // Fetch user data from Clerk using the user ID
    const user = await client.users.getUser(userId)

    // Access and return private metadata
    const privateMetadata = user.privateMetadata || {};

    return {
      success: true,
      data: {
        smtpMail: privateMetadata.smtpMail || null,
        smtpPassword: privateMetadata.smtpPassword || null,
        huggingfaceToken: privateMetadata.huggingfaceToken || null,
      },
    };
  } catch (error) {
    console.error('Error fetching user metadata:', error);
    return { success: false, error: error.message };
  }
}
