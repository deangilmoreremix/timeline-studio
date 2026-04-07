"use client"

import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Circle } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { HorizontalStepperProps, StepItem } from "../types/ui-components"

const HorizontalStepper = React.forwardRef<HTMLDivElement, HorizontalStepperProps>(
  (
    {
      className,
      steps,
      currentStep = 0,
      onStepChange,
      allowSkip = false,
      showProgress = true,
      timelineContext,
      ...props
    },
    ref,
  ) => {
    const [activeStep, setActiveStep] = React.useState(currentStep)
    const currentStepData = steps[activeStep]

    const handleStepChange = React.useCallback(
      (stepIndex: number) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
          const step = steps[stepIndex]
          if (!step.disabled) {
            setActiveStep(stepIndex)
            onStepChange?.(step.id, stepIndex)
          }
        }
      },
      [steps, onStepChange],
    )

    const goToNext = React.useCallback(() => {
      handleStepChange(activeStep + 1)
    }, [activeStep, handleStepChange])

    const goToPrevious = React.useCallback(() => {
      handleStepChange(activeStep - 1)
    }, [activeStep, handleStepChange])

    const progressPercentage = ((activeStep + 1) / steps.length) * 100

    const getStepIcon = (step: StepItem, index: number) => {
      if (step.error) {
        return <AlertCircle className="w-5 h-5 text-destructive" />
      }
      if (step.completed) {
        return <CheckCircle className="w-5 h-5 text-green-500" />
      }
      if (index === activeStep) {
        return <Circle className="w-5 h-5 fill-primary text-primary" />
      }
      return <Circle className="w-5 h-5 text-muted-foreground" />
    }

    return (
      <div
        ref={ref}
        className={cn("space-y-6", className)}
        data-timeline-workflow-type={timelineContext?.workflowType}
        {...props}
      >
        {/* Progress Bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {activeStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => handleStepChange(index)}
                disabled={step.disabled || (!allowSkip && index > activeStep)}
                className={cn(
                  "flex flex-col items-center gap-2 p-2 rounded-lg transition-colors",
                  "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed",
                  index === activeStep && "bg-muted",
                  step.completed && "text-green-600",
                  step.error && "text-destructive",
                )}
              >
                {getStepIcon(step, index)}
                <div className="text-center">
                  <div
                    className={cn(
                      "text-xs font-medium",
                      index === activeStep ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1 max-w-24 truncate">{step.description}</div>
                  )}
                </div>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-4 mt-[-20px]",
                    steps[index].completed ? "bg-green-500" : "bg-muted-foreground/30",
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[200px] p-6 border rounded-lg bg-card">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{currentStepData?.title}</h3>
              {currentStepData?.description && (
                <p className="text-sm text-muted-foreground mt-1">{currentStepData.description}</p>
              )}
            </div>

            {currentStepData?.error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">{currentStepData.error}</span>
              </div>
            )}

            <div className="flex-1">{currentStepData?.content}</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={activeStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {allowSkip && activeStep < steps.length - 1 && (
              <Button variant="ghost" onClick={() => handleStepChange(activeStep + 1)}>
                Skip
              </Button>
            )}

            {activeStep < steps.length - 1 ? (
              <Button onClick={goToNext} disabled={currentStepData?.disabled} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="flex items-center gap-2" disabled={currentStepData?.disabled}>
                Complete
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  },
)

HorizontalStepper.displayName = "HorizontalStepper"

export type { HorizontalStepperProps, StepItem }
export { HorizontalStepper }
