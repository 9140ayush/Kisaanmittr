"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressTrackerProps {
  steps: string[]
  currentStep: number
}

export function ProgressTracker({ steps, currentStep }: ProgressTrackerProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
              index < currentStep
                ? "bg-primary text-primary-foreground"
                : index === currentStep
                  ? "border-2 border-primary bg-background text-primary"
                  : "border-2 border-border bg-background text-muted-foreground",
            )}
          >
            {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-1 h-1 flex-1 rounded-full sm:mx-2",
                index < currentStep - 1 ? "bg-primary" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
