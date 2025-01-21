import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoopDetails } from "@/components/manage-loops/LoopDetails";
import { getEmailQueueByLoopId, getLoopById } from "@/app/actions/Loops";
import { auth } from "@clerk/nextjs/server";
import { EmailPreview } from "@/components/start-loop/EmailPreview";

async function LoopDetailsPage({ params }) {
  try {
    // Handle authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication failed. Please log in.");
    }

    const { slug } = await params;

    // Fetch loop details
    const { success: loopSuccess, data: loopData, error: loopError } = await getLoopById(userId, slug);
    if (!loopSuccess) {
      throw new Error(loopError || "Failed to retrieve loop details.");
    }

    // Fetch email queue data
    const { success: queueSuccess, data: queueData, error: queueError } = await getEmailQueueByLoopId(slug);
    
    if (!queueSuccess) {
      throw new Error(queueError || "Failed to retrieve email queue data.");
    }

    // Render the page with fetched data
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
        <div className="flex gap-4 flex-col md:flex-row">

        <LoopDetails loop={loopData} />
        {queueData.length > 0 && (
          <EmailPreview emailTemplate={queueData} totalRecords={queueData.length} />
        )}
        </div>
      </div>
    );
  } catch (error) {
    // Return error UI directly from the catch block
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error.message}</p>
        </div>
        <div className="mt-4">
          <Link href="/dashboard/your-loops">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Loops
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default LoopDetailsPage;
