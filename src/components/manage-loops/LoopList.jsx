import { LoopCard } from "./LoopCard"


export function LoopList({ loops }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loops.map((loop) => (
        <LoopCard key={loop._id} loop={loop}  />
      ))}
    </div>
  )
}

