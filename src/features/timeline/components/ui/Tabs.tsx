"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TabItem, TabsProps, UseTimelineTabsReturn } from "../types/ui-components"

function useTimelineTabs(defaultActiveTab?: string, onTabChange?: (tabId: string) => void): UseTimelineTabsReturn {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab || "")
  const [tabHistory, setTabHistory] = React.useState<string[]>([])

  const handleTabChange = React.useCallback(
    (tabId: string) => {
      setActiveTab(tabId)
      setTabHistory((prev) => [...prev.slice(-4), tabId]) // Keep last 5 tabs
      onTabChange?.(tabId)
    },
    [onTabChange],
  )

  const goToPreviousTab = React.useCallback(() => {
    if (tabHistory.length > 1) {
      const previousTab = tabHistory[tabHistory.length - 2]
      handleTabChange(previousTab)
    }
  }, [tabHistory, handleTabChange])

  return {
    activeTab,
    setActiveTab: handleTabChange,
    tabHistory,
    goToPreviousTab,
  }
}

const TimelineTabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  (
    {
      className,
      tabs,
      defaultActiveTab,
      activeTab: controlledActiveTab,
      onTabChange,
      variant = "default",
      size = "md",
      fullWidth = false,
      timelineContext,
      ...props
    },
    ref,
  ) => {
    const { activeTab, setActiveTab } = useTimelineTabs(defaultActiveTab, onTabChange)
    const currentActiveTab = controlledActiveTab || activeTab

    const sizeClasses = {
      sm: "h-8 text-xs",
      md: "h-9 text-sm",
      lg: "h-10 text-base",
    }

    const variantClasses = {
      default: "bg-muted text-muted-foreground rounded-lg p-[3px]",
      pills: "bg-transparent text-muted-foreground gap-1 p-0",
      underline: "bg-transparent text-muted-foreground border-b border-border rounded-none p-0",
    }

    return (
      <TabsPrimitive.Root
        ref={ref}
        value={currentActiveTab}
        onValueChange={setActiveTab}
        className={cn("flex flex-col gap-2", className)}
        data-timeline-panel-type={timelineContext?.panelType}
        {...props}
      >
        <TabsPrimitive.List
          className={cn(
            "inline-flex items-center justify-center",
            variantClasses[variant],
            fullWidth && "w-full",
            !fullWidth && "w-fit",
          )}
        >
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                sizeClasses[size],
                variant === "default" && [
                  "flex-1 rounded-md border border-transparent px-2 py-1 font-medium",
                  "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                  "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground dark:text-muted-foreground",
                ],
                variant === "pills" && [
                  "rounded-full border border-transparent px-3 py-1 font-medium",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
                  "hover:bg-muted hover:text-foreground",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                ],
                variant === "underline" && [
                  "rounded-none border-b-2 border-transparent px-3 py-2 font-medium",
                  "data-[state=active]:border-primary data-[state=active]:text-primary",
                  "hover:text-foreground",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                ],
                fullWidth && "flex-1",
                tab.disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {tab.label}
              {tab.badge && (
                <Badge
                  variant={typeof tab.badge === "number" && tab.badge > 99 ? "secondary" : "default"}
                  className="ml-1 h-5 min-w-5 text-xs px-1 flex items-center justify-center"
                >
                  {typeof tab.badge === "number" && tab.badge > 99 ? "99+" : tab.badge}
                </Badge>
              )}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>

        {tabs.map((tab) => (
          <TabsPrimitive.Content key={tab.id} value={tab.id} className="flex-1 outline-none mt-2">
            {tab.content}
          </TabsPrimitive.Content>
        ))}
      </TabsPrimitive.Root>
    )
  },
)

TimelineTabs.displayName = "TimelineTabs"

export type { TabItem, TabsProps }
export { TimelineTabs, useTimelineTabs }
