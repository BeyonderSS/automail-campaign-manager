"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Play } from "lucide-react"
import { triggerLoop } from "@/app/actions/Loops"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast" // Ensure you have a ToastAction component

export function ProcessLoopButton({ loopId }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleProcessLoop = async () => {
    setIsProcessing(true)
    try {
      const response = await triggerLoop(loopId)
      
      if (response.success) {
        toast({
          title: "Success!",
          description: `Emails for loop ${loopId} are being processed.`,
        })
      } else {
        toast({
          title: "Error!",
          description: response.error || "Failed to process loop",
          action: <ToastAction altText="Try again" onClick={handleProcessLoop}>Try again</ToastAction>,
        })
        console.error("Failed to process loop:", response.error)
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again" onClick={handleProcessLoop}>Try again</ToastAction>,
      })
      console.error("Error processing loop:", error)
    }
    setIsProcessing(false)
  }

  return (
    <Button onClick={handleProcessLoop} disabled={isProcessing}>
      <Play className="mr-2 h-4 w-4" />
      {isProcessing ? "Processing..." : "Start Loop"}
    </Button>
  )
}
