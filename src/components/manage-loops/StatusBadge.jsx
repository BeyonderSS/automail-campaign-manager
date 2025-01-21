import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }) {
  const statusConfig = {
    incomplete: { color: "bg-gray-500", message: "Incomplete Loop" },
    pending: { color: "bg-yellow-500", message: "Loop Trigger Pending" },
    "in-progress": { color: "bg-blue-500", message: "In Progress" },
    completed: { color: "bg-green-500", message: "Completed Successfully" },
    failed: { color: "bg-red-500", message: "Failed" },
    default: { color: "bg-gray-300", message: "Unknown Status" },
  };

  const { color, message } = statusConfig[status] || statusConfig.default;

  return (
    <Badge className={`${color} text-white`}>
      {message}
    </Badge>
  );
}
