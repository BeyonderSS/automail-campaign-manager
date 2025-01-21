import { StatusBadge } from "./StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Calendar, AlertCircle } from "lucide-react";
import { ProcessLoopButton } from "./ProcessLoopButton";
import Link from "next/link";
import { Button } from "../ui/button";

export function LoopDetails({ loop }) {
  const progress = (loop.sentEmails / loop.totalEmails) * 100;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{loop.title}</span>
          <StatusBadge status={loop.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{loop.description}</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Progress</span>
            <span>
              {loop.sentEmails} / {loop.totalEmails} emails sent
            </span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span>{loop.failedEmails} emails failed</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              Created on {new Date(loop.createdAt).toLocaleDateString()}
            </span>
          </div>
          {loop.completedAt && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                Completed on {new Date(loop.completedAt).toLocaleDateString()}
              </span>
            </div>
          )}
          {loop.status === "failed" && (
            <div className="flex items-center text-red-500">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>
                Loop failed. Please check your email configuration and try
                again.
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {loop.status === "pending" && <ProcessLoopButton loopId={loop._id} />}
        {loop.status === "incomplete" && (
          <Link href={`/dashboard/start-loop?loopId=${loop._id}`}>
            <Button>Complete Your Loop</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
