import { getAllLoopsByUserId } from "@/app/actions/Loops";
import { LoopCard } from "./LoopCard";
import { auth } from "@clerk/nextjs/server";

export async function LoopList() {
  const { userId } = await auth();

  const {
    success,
    data,
    error: fetchError,
  } = await getAllLoopsByUserId(userId);

  if (!success) {
    return (
      <div className="text-red-500">
        {fetchError || "Failed to fetch loops. Please try again later."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((loop) => (
        <LoopCard key={loop._id} loop={loop} />
      ))}
    </div>
  );
}
