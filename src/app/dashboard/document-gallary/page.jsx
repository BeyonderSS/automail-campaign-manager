import { getDocumentsByUser } from "@/app/actions/DocumentActions";
import DocumentGallaryHome from "@/components/document-gallary";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { getUserMetadata } from "@/app/actions/CredentialActions";
import { Lock } from "lucide-react";
import Link from "next/link";

async function page() {
  const { userId } = await auth();
  const tokenData = await getUserMetadata(userId);
  const isPageLocked = tokenData.data.uploadThingToken ? false : true;
  const documentsData = await getDocumentsByUser(userId);
  console.log(documentsData?.data);

  // If the page is locked, show a message or redirect
  if (isPageLocked) {
    return (
      <div className="flex items-center justify-center p-10 text-center">
        <div>
          <h1 className="mb-4 flex w-full flex-col items-center justify-center text-2xl font-bold">
            <Lock className="" />
            Page Locked
          </h1>
          <p className="text-lg">
            This document gallery is locked. Please{" "}
            <Link
              href="/dashboard/profile/manage-credentials"
              className="text-blue-500 underline"
            >
              go to manage credentials
            </Link>{" "}
            to update your UploadThing v7 token to access the Document Gallery.
            You can find this token in your UploadThing dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Render the document gallery if the page is not locked
  return <DocumentGallaryHome documentsData={documentsData?.data} />;
}

export default page;
