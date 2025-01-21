import { getAllLoopsByUserId } from "@/app/actions/Loops";
import { LoopList } from "@/components/manage-loops/LoopList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function LoopsPage() {
  let loops = [];
  let error = null;

  try {
    const { userId } = await auth();

    // Fetch all loops by the user's ID
    const { success, data, error: fetchError } = await getAllLoopsByUserId(userId);

    if (!success) {
      throw new Error(fetchError || "Failed to retrieve loops");
    }

    loops = data;
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Loops</h1>
        <Link href="/dashboard/start-loop">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Loop
          </Button>
        </Link>
      </div>
      {loops.length > 0 ? <LoopList loops={loops} /> : <p>No loops found.</p>}
    </div>
  );
}
