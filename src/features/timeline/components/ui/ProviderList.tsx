"use client"

import { AlertCircle, CheckCircle, Loader2, Settings } from "lucide-react"
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AIProvider, ProviderListProps, UseProviderListReturn } from "../types/ui-components"

function useProviderList(providers: AIProvider[], selectedProviderId?: string): UseProviderListReturn {
  const [availableProviders, setAvailableProviders] = React.useState(providers)
  const [selectedProvider, setSelectedProvider] = React.useState<AIProvider | null>(
    providers.find((p) => p.id === selectedProviderId) || null,
  )
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const selectProvider = React.useCallback(
    (providerId: string) => {
      const provider = availableProviders.find((p) => p.id === providerId)
      if (provider && provider.status === "available") {
        setSelectedProvider(provider)
      }
    },
    [availableProviders],
  )

  const filterProviders = React.useCallback(
    (capability: string) => {
      return availableProviders.filter((provider) => provider.capabilities?.includes(capability))
    },
    [availableProviders],
  )

  const refreshProviders = React.useCallback(async () => {
    setIsRefreshing(true)
    try {
      // In a real implementation, this would check provider status
      // For now, simulate a refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update provider statuses (mock)
      setAvailableProviders((prev) =>
        prev.map((provider) => ({
          ...provider,
          status: Math.random() > 0.2 ? "available" : ("unavailable" as const),
        })),
      )
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Update selected provider when providers change
  React.useEffect(() => {
    if (selectedProvider) {
      const updatedProvider = availableProviders.find((p) => p.id === selectedProvider.id)
      if (updatedProvider && updatedProvider.status !== selectedProvider.status) {
        setSelectedProvider(updatedProvider)
      }
    }
  }, [availableProviders, selectedProvider])

  return {
    availableProviders,
    selectedProvider,
    selectProvider,
    filterProviders,
    refreshProviders,
  }
}

const ProviderList = React.forwardRef<HTMLDivElement, ProviderListProps>(
  (
    {
      className,
      providers,
      selectedProvider,
      onProviderSelect,
      showStatus = true,
      showCapabilities = true,
      filterByCapability,
      timelineContext,
      ...props
    },
    ref,
  ) => {
    const {
      availableProviders,
      selectedProvider: internalSelected,
      selectProvider,
      filterProviders,
      refreshProviders,
    } = useProviderList(providers, selectedProvider)

    const currentSelected = selectedProvider || internalSelected?.id
    const displayProviders = filterByCapability ? filterProviders(filterByCapability) : availableProviders

    const getStatusIcon = (status: AIProvider["status"]) => {
      switch (status) {
        case "available":
          return <CheckCircle className="w-4 h-4 text-green-500" />
        case "unavailable":
          return <AlertCircle className="w-4 h-4 text-muted-foreground" />
        case "error":
          return <AlertCircle className="w-4 h-4 text-destructive" />
        default:
          return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      }
    }

    const getStatusColor = (status: AIProvider["status"]) => {
      switch (status) {
        case "available":
          return "text-green-600"
        case "unavailable":
          return "text-muted-foreground"
        case "error":
          return "text-destructive"
        default:
          return "text-muted-foreground"
      }
    }

    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        data-timeline-operation-type={timelineContext?.operationType}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">AI Providers</h3>
            <p className="text-xs text-muted-foreground">Select an AI provider for your timeline operations</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshProviders}
            disabled={false} // Could be disabled during refresh
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Provider Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {displayProviders.map((provider) => (
            <Card
              key={provider.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                currentSelected === provider.id && "ring-2 ring-primary",
                provider.status !== "available" && "opacity-60",
              )}
              onClick={() => {
                if (provider.status === "available") {
                  selectProvider(provider.id)
                  onProviderSelect?.(provider.id)
                }
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {provider.icon}
                    <CardTitle className="text-sm">{provider.name}</CardTitle>
                  </div>
                  {showStatus && getStatusIcon(provider.status)}
                </div>
                {provider.description && <CardDescription className="text-xs">{provider.description}</CardDescription>}
              </CardHeader>

              <CardContent className="pt-0">
                {showCapabilities && provider.capabilities && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {provider.capabilities.slice(0, 3).map((capability) => (
                      <Badge key={capability} variant="secondary" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {provider.capabilities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{provider.capabilities.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {showStatus && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className={getStatusColor(provider.status)}>
                      {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                    </span>
                    {provider.priority && (
                      <Badge variant="outline" className="text-xs">
                        Priority {provider.priority}
                      </Badge>
                    )}
                  </div>
                )}

                {currentSelected === provider.id && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <CheckCircle className="w-3 h-3" />
                    Selected
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {displayProviders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No providers available</p>
            <p className="text-xs">Try refreshing or check your configuration</p>
          </div>
        )}

        {/* Filter info */}
        {filterByCapability && (
          <div className="text-xs text-muted-foreground text-center">
            Showing providers with "{filterByCapability}" capability
          </div>
        )}
      </div>
    )
  },
)

ProviderList.displayName = "ProviderList"

export type { AIProvider, ProviderListProps }
export { ProviderList, useProviderList }
