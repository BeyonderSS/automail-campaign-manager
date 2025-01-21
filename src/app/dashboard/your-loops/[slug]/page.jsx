import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoopDetails } from "@/components/manage-loops/LoopDetails";
import { getLoopById } from "@/app/actions/Loops";
import { auth } from "@clerk/nextjs/server";

async function LoopDetailsPage({ params }) {
  let loop = null;
  let error = null;

  try {
    // Handle authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication failed. Please log in.");
    }

    const { slug } = params;
    const { success, data, error: fetchError } = await getLoopById(userId, slug);
    
    if (!success) {
      throw new Error(fetchError || "Loop not found");
    }

    loop = data;
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
      {loop ? <LoopDetails loop={loop} /> : null}
    </div>
  );
}

export default LoopDetailsPage;
