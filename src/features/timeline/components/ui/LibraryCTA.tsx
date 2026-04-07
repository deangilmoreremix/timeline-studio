"use client"

import { Loader2 } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LibraryCTAProps } from "../types/ui-components"

const LibraryCTA = React.forwardRef<HTMLDivElement, LibraryCTAProps>(
  (
    {
      className,
      title,
      description,
      actionLabel,
      onAction,
      icon,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      timelineContext,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    }

    const titleSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    }

    const descriptionSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all hover:shadow-md cursor-pointer",
          variant === "primary" && "border-primary/20 bg-primary/5 hover:bg-primary/10",
          variant === "secondary" && "border-secondary/20 bg-secondary/5 hover:bg-secondary/10",
          variant === "outline" && "border-2 hover:border-primary/50",
          variant === "ghost" && "border-transparent bg-transparent hover:bg-muted",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        onClick={!disabled && !loading ? onAction : undefined}
        data-timeline-library-type={timelineContext?.libraryType}
        data-timeline-project-id={timelineContext?.projectId}
        {...props}
      >
        <CardHeader className={cn("pb-2", sizeClasses[size])}>
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={cn(
                  "flex-shrink-0",
                  size === "sm" && "w-6 h-6",
                  size === "md" && "w-8 h-8",
                  size === "lg" && "w-10 h-10",
                )}
              >
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className={cn("font-semibold leading-tight", titleSizeClasses[size])}>{title}</CardTitle>
              {description && (
                <CardDescription className={cn("mt-1 leading-relaxed", descriptionSizeClasses[size])}>
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Button
            className={cn(
              "w-full",
              variant === "primary" && "bg-primary hover:bg-primary/90",
              variant === "secondary" && "bg-secondary hover:bg-secondary/90",
              variant === "outline" && "border-2",
              variant === "ghost" && "bg-transparent hover:bg-muted",
            )}
            size={size}
            disabled={disabled || loading}
            onClick={(e) => {
              e.stopPropagation()
              if (!disabled && !loading) {
                onAction()
              }
            }}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    )
  },
)

LibraryCTA.displayName = "LibraryCTA"

export type { LibraryCTAProps }
export { LibraryCTA }
