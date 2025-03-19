import { LoopCardSkeleton } from "@/components/manage-loops/Loaders/LoopCardSkeleton";
import { LoopList } from "@/components/manage-loops/LoopList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function LoopsPage() {
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
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoopCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <LoopList />
      </Suspense>
    </div>
  );
}
