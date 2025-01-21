import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }) {
  const statusColors = {
    pending: "bg-yellow-500",
    "in-progress": "bg-blue-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
  }

  return <Badge className={`${statusColors[status]} text-white`}>{status}</Badge>
}

