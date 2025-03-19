"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EmailPreviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="text-center">
            <Skeleton className="mx-auto h-7 w-36" /> {/* Title */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" /> {/* Subject label */}
            <Skeleton className="h-5 w-3/4" /> {/* Subject content */}
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" /> {/* Body label */}
            <div className="space-y-2 rounded-md border p-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" /> {/* Attachments label */}
            <div className="pl-5">
              <Skeleton className="h-5 w-40" /> {/* Attachment item */}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-8 w-32" /> {/* Preview counter */}
            <div className="space-x-2">
              <Skeleton className="inline-block h-9 w-24" /> {/* Previous button */}
              <Skeleton className="inline-block h-9 w-24" /> {/* Next button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

