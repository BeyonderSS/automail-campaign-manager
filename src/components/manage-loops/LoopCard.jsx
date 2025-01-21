import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import Link from "next/link"
import { Mail, Calendar } from "lucide-react"
import { ProcessLoopButton } from "./ProcessLoopButton"


export function LoopCard({ loop }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Link href={`/dashboard/your-loops/${loop._id}`} className="hover:underline">
            {loop.title}
          </Link>
          <StatusBadge status={loop.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <Mail className="mr-2 h-4 w-4" />
          <span>
            {loop.sentEmails} / {loop.totalEmails} emails sent
          </span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Created on {new Date(loop.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        {loop.status === "pending" && <ProcessLoopButton loopId={loop._id}  />}
      </CardFooter>
    </Card>
  )
}

