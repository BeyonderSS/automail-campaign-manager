import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define a FileRoute for document uploads
  documentUploader: f({
    pdf: {
 
      maxFileSize: "5MB",
      maxFileCount: 1,
    },
  })
    // Middleware for authentication and metadata
    .middleware(async ({ req }) => {
      // Authenticate the user
      const user = await auth(req);

      // If no user is found, throw an error
      if (!user) throw new UploadThingError("Unauthorized");

      // Return metadata that will be passed to `onUploadComplete`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs after a document upload is complete
      console.log("Document upload complete for userId:", metadata.userId);
      console.log("Uploaded document URL:", file.url);

      // Perform any additional server-side actions here
      return { uploadedBy: metadata.userId };
    }),
};
