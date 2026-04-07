"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { TogglerOption, TogglerProps } from "../types/ui-components"

const Toggler = React.forwardRef<HTMLDivElement, TogglerProps>(
  (
    {
      className,
      options,
      value,
      defaultValue,
      onChange,
      variant = "buttons",
      size = "md",
      fullWidth = false,
      timelineContext,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || value)
    const currentValue = value !== undefined ? value : internalValue

    const handleChange = React.useCallback(
      (newValue: string | number | boolean) => {
        setInternalValue(newValue)
        onChange?.(newValue)
      },
      [onChange],
    )

    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
    }

    if (variant === "switch" && options.length === 2) {
      const [offOption, onOption] = options
      const isChecked = currentValue === onOption.value

      return (
        <div
          ref={ref}
          className={cn("flex items-center space-x-2", className)}
          data-timeline-setting-type={timelineContext?.settingType}
          data-timeline-track-id={timelineContext?.trackId}
          data-timeline-clip-id={timelineContext?.clipId}
          {...props}
        >
          <Label htmlFor={`toggle-${timelineContext?.settingType}`} className="text-sm font-medium">
            {offOption.label}
          </Label>
          <Switch
            id={`toggle-${timelineContext?.settingType}`}
            checked={isChecked}
            onCheckedChange={(checked) => handleChange(checked ? onOption.value : offOption.value)}
            disabled={offOption.disabled || onOption.disabled}
          />
          <Label htmlFor={`toggle-${timelineContext?.settingType}`} className="text-sm font-medium">
            {onOption.label}
          </Label>
        </div>
      )
    }

    if (variant === "radio") {
      return (
        <RadioGroup
          value={String(currentValue)}
          onValueChange={(value) => {
            const option = options.find((opt) => String(opt.value) === value)
            if (option) handleChange(option.value)
          }}
          className={cn("space-y-2", className)}
          data-timeline-setting-type={timelineContext?.settingType}
          data-timeline-track-id={timelineContext?.trackId}
          data-timeline-clip-id={timelineContext?.clipId}
        >
          {options.map((option) => (
            <div key={String(option.value)} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(option.value)}
                id={`radio-${String(option.value)}`}
                disabled={option.disabled}
              />
              <Label htmlFor={`radio-${String(option.value)}`} className="flex items-center gap-2 text-sm font-medium">
                {option.icon}
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )
    }

    // Default button variant
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex rounded-md border border-input bg-transparent p-1",
          fullWidth && "w-full",
          className,
        )}
        data-timeline-setting-type={timelineContext?.settingType}
        data-timeline-track-id={timelineContext?.trackId}
        data-timeline-clip-id={timelineContext?.clipId}
        {...props}
      >
        {options.map((option) => {
          const isSelected = currentValue === option.value

          return (
            <Button
              key={String(option.value)}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              disabled={option.disabled}
              onClick={() => handleChange(option.value)}
              className={cn(
                sizeClasses[size],
                "flex items-center gap-2 rounded-sm",
                fullWidth && "flex-1",
                isSelected && "bg-primary text-primary-foreground shadow-sm",
                !isSelected && "hover:bg-muted hover:text-foreground",
              )}
            >
              {option.icon}
              {option.label}
            </Button>
          )
        })}
      </div>
    )
  },
)

Toggler.displayName = "Toggler"

export type { TogglerOption, TogglerProps }
export { Toggler }
