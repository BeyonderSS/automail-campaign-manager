import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoopDetailsSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" /> {/* Title */}
          <Skeleton className="h-5 w-24 rounded-full" /> {/* Status badge */}
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-4 h-16 w-full" /> {/* Description */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" /> {/* Progress label */}
            <Skeleton className="h-5 w-32" /> {/* Emails sent count */}
          </div>
          <Skeleton className="h-4 w-full" /> {/* Progress bar */}
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4" /> {/* Icon */}
            <Skeleton className="h-5 w-36" /> {/* Failed emails */}
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4" /> {/* Icon */}
            <Skeleton className="h-5 w-48" /> {/* Created date */}
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4" /> {/* Icon */}
            <Skeleton className="h-5 w-48" /> {/* Completed date */}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-36" /> {/* Button */}
      </CardFooter>
    </Card>
  )
}

