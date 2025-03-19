import { getDocumentsByUser } from "@/app/actions/DocumentActions";
import DocumentGallaryHome from "@/components/document-gallary";
import React, { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getUserMetadata } from "@/app/actions/CredentialActions";
import { Lock } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchData() {
  const { userId } = await auth();

  const [tokenData, documentsData] = await Promise.all([
    getUserMetadata(userId),
    getDocumentsByUser(userId),
  ]);

  return {
    isPageLocked: !tokenData.data.uploadThingToken,
    documentsData: documentsData?.data,
  };
}

async function DocumentGallaryWrapper() {
  const { isPageLocked, documentsData } = await fetchData();

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

  return <DocumentGallaryHome documentsData={documentsData} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <DocumentGallaryWrapper />
    </Suspense>
  );
}
