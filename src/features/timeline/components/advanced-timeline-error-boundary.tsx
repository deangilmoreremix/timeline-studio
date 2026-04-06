/**
 * Advanced Timeline Error Boundary
 *
 * Production-ready error boundary for advanced timeline features
 * Provides graceful degradation and error reporting
 */

import React from "react"

import { createLogger } from "@/lib/tauri-logger"

const logger = createLogger("AdvancedTimelineErrorBoundary")

interface Props {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
}

export class AdvancedTimelineErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `timeline_error_${Date.now()}_${Math.random().toString(36).substring(7)}`

    logger.error(`Advanced timeline error [${errorId}]:`, error)

    return {
      hasError: true,
      error,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(`Advanced timeline error details [${this.state.errorId}]:`, {
      error,
      errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report to error tracking service (if available)
    if (typeof window !== "undefined" && (window as any).errorReporter) {
      ;(window as any).errorReporter.captureException(error, {
        extra: {
          component: "AdvancedTimeline",
          errorId: this.state.errorId,
          errorInfo,
        },
      })
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      // Default error UI
      return (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>⚠️ Advanced Timeline Error</div>
          <div style={{ marginBottom: "15px" }}>
            An error occurred while rendering the advanced timeline. This might be due to:
          </div>
          <ul style={{ marginBottom: "15px", paddingLeft: "20px" }}>
            <li>WebGL not supported in your browser</li>
            <li>Insufficient memory for large projects</li>
            <li>Corrupted project data</li>
            <li>Experimental features enabled</li>
          </ul>
          <div style={{ marginBottom: "15px" }}>
            <strong>Error ID:</strong> {this.state.errorId}
          </div>
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={this.resetError}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 16px",
                marginLeft: "10px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Reload Page
            </button>
          </div>
          <details style={{ fontSize: "12px", color: "#7f1d1d" }}>
            <summary style={{ cursor: "pointer", marginBottom: "5px" }}>Technical Details</summary>
            <pre
              style={{
                backgroundColor: "#f9fafb",
                padding: "10px",
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "11px",
                border: "1px solid #d1d5db",
              }}
            >
              {this.state.error.stack}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Default error fallback component
 */
export function AdvancedTimelineErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "400px",
        padding: "20px",
        backgroundColor: "#f8fafc",
        border: "2px dashed #cbd5e1",
        borderRadius: "8px",
        color: "#475569",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎬</div>
      <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Timeline Temporarily Unavailable</div>
      <div style={{ textAlign: "center", marginBottom: "20px", maxWidth: "400px" }}>
        The advanced timeline encountered an error. You can continue using the basic timeline or try reloading the
        advanced features.
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={resetError}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Retry Advanced Timeline
        </button>
        <button
          onClick={() => {
            // Disable advanced features and use basic timeline
            if (typeof window !== "undefined" && (window as any).disableAdvancedTimeline) {
              ;(window as any).disableAdvancedTimeline()
            }
            resetError()
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Use Basic Timeline
        </button>
      </div>
    </div>
  )
}

/**
 * HOC for wrapping components with advanced timeline error boundary
 */
export function withAdvancedTimelineErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>,
) {
  const WrappedComponent = (props: P) => (
    <AdvancedTimelineErrorBoundary fallback={fallback}>
      <Component {...props} />
    </AdvancedTimelineErrorBoundary>
  )

  WrappedComponent.displayName = `withAdvancedTimelineErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Hook for error reporting in advanced timeline components
 */
export function useAdvancedTimelineError() {
  return {
    reportError: (error: Error, context?: any) => {
      logger.error("Advanced timeline error:", { error, context })

      // Send to error tracking if available
      if (typeof window !== "undefined" && (window as any).errorReporter) {
        ;(window as any).errorReporter.captureException(error, {
          extra: {
            component: "AdvancedTimeline",
            context,
            timestamp: new Date().toISOString(),
          },
        })
      }
    },

    reportWarning: (message: string, context?: any) => {
      logger.warn("Advanced timeline warning:", { message, context })
    },
  }
}
