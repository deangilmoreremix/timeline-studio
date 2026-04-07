"use client"

import { AlertCircle, CheckCircle } from "lucide-react"
import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FormInputGroupProps, UseFormInputGroupReturn } from "../types/ui-components"

function useFormInputGroup(props: FormInputGroupProps): UseFormInputGroupReturn {
  const [state, setState] = React.useState({
    isValid: true,
    hasError: false,
    errorMessage: undefined as string | undefined,
  })

  const validate = React.useCallback(
    (value: any): boolean => {
      if (!props.validation) return true

      const isValid = props.validation.rule(value)
      const errorMessage = isValid ? undefined : props.validation.message

      setState({
        isValid,
        hasError: !isValid,
        errorMessage,
      })

      return isValid
    },
    [props.validation],
  )

  const getErrorMessage = React.useCallback(() => {
    return props.error || state.errorMessage
  }, [props.error, state.errorMessage])

  const clearError = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasError: false,
      errorMessage: undefined,
    }))
  }, [])

  return {
    validate,
    getErrorMessage,
    clearError,
    state: {
      isValid: state.isValid,
      hasError: state.hasError,
      errorMessage: state.errorMessage,
    },
  }
}

const FormInputGroup = React.forwardRef<HTMLDivElement, FormInputGroupProps>(
  ({ className, label, error, required, disabled, children, validation, timelineContext, ...props }, ref) => {
    const { getErrorMessage, state } = useFormInputGroup({
      label,
      error,
      required,
      disabled,
      children,
      validation,
      timelineContext,
    })

    const hasError = error || state.hasError
    const errorMessage = getErrorMessage()

    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        data-timeline-track-id={timelineContext?.trackId}
        data-timeline-clip-id={timelineContext?.clipId}
        data-timeline-project-id={timelineContext?.projectId}
        {...props}
      >
        {label && (
          <Label
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              hasError && "text-destructive",
              required && "after:content-['*'] after:ml-1 after:text-destructive",
            )}
          >
            {label}
            {state.isValid && !hasError && <CheckCircle className="inline-block w-4 h-4 ml-2 text-green-500" />}
          </Label>
        )}

        <div className="relative">
          {React.cloneElement(children as React.ReactElement, {
            "aria-invalid": hasError,
            "aria-describedby": errorMessage ? `${props["data-testid"]}-error` : undefined,
            disabled: disabled || (children as React.ReactElement).props.disabled,
          })}

          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="w-4 h-4 text-destructive" />
            </div>
          )}
        </div>

        {errorMessage && (
          <p id={`${props["data-testid"]}-error`} className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    )
  },
)

FormInputGroup.displayName = "FormInputGroup"

export type { FormInputGroupProps }
export { FormInputGroup, useFormInputGroup }
