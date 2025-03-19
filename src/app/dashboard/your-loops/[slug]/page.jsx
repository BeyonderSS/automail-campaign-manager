import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoopDetails } from "@/components/manage-loops/LoopDetails";
import { getEmailQueueByLoopId, getLoopById } from "@/app/actions/Loops";
import { auth } from "@clerk/nextjs/server";
import { EmailPreview } from "@/components/start-loop/EmailPreview";
import { EmailPreviewSkeleton } from "@/components/start-loop/Loaders/EmailPreviewSkeleton";
import { LoopDetailsSkeleton } from "@/components/manage-loops/Loaders/LoopDetailsSkeleton";

async function LoopDetailsPage({ params }) {
  const { userId } = await auth();
  // Handle authentication
  if (!userId) {
    throw new Error("Authentication failed. Please log in.");
  }

  const { slug } = await params;
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/dashboard/your-loops">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loops
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Suspense fallback={<LoopDetailsSkeleton/>}>
          <LoopDetails slug={slug} />
        </Suspense>
        <Suspense fallback={<EmailPreviewSkeleton/>}>
          <EmailRenderer slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}

async function EmailRenderer({ slug }) {
  const {
    success: queueSuccess,
    data: queueData,
    error: queueError,
  } = await getEmailQueueByLoopId(slug);

  if (!queueSuccess || queueError) {
    return <div>Error loading email queue: {queueError || "Unknown error"}</div>;
  }

  if (queueData.length > 0) {
    return (
      <EmailPreview emailTemplate={queueData} totalRecords={queueData.length} />
    );
  }

  return <div>No emails found in the queue.</div>;
}

export default LoopDetailsPage;
