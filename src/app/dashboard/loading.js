import { Ripple } from "@/components/ui/ripple";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden ">
    <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
      Loading...
    </p>
    <Ripple />
  </div>

}