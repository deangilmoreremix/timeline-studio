/**
 * Real-time Collaboration Engine
 *
 * Multi-user editing with operational transformation and conflict resolution
 */

export interface User {
  id: string
  name: string
  color: string
  avatar?: string
  cursor?: { x: number; y: number; timestamp: number }
  selection?: any
  permissions: UserPermission[]
}

export type UserPermission = "read" | "write" | "admin" | "export" | "delete"

export interface CollaborationSession {
  id: string
  projectId: string
  name: string
  users: User[]
  activeUsers: string[]
  createdAt: number
  lastActivity: number
  settings: SessionSettings
}

export interface SessionSettings {
  maxUsers: number
  allowAnonymous: boolean
  requireApproval: boolean
  autoSave: boolean
  conflictResolution: "manual" | "automatic" | "last-writer-wins"
  versionControl: boolean
}

export interface Operation {
  id: string
  userId: string
  timestamp: number
  type: OperationType
  path: string[]
  value: any
  previousValue?: any
  metadata?: any
}

export type OperationType = "insert" | "update" | "delete" | "move" | "transform"

export interface Conflict {
  id: string
  operations: Operation[]
  resolved: boolean
  resolution?: Operation
  timestamp: number
}

export interface CollaborationEvent {
  type: "user-joined" | "user-left" | "operation" | "conflict" | "cursor" | "selection"
  userId: string
  data: any
  timestamp: number
}

class OperationalTransformation {
  private operations: Operation[] = []
  private conflicts: Conflict[] = []

  // Apply operation with transformation
  transform(operation: Operation, concurrentOps: Operation[]): Operation {
    let transformedOp = { ...operation }

    for (const concurrentOp of concurrentOps) {
      if (this.conflictsWith(transformedOp, concurrentOp)) {
        transformedOp = this.resolveConflict(transformedOp, concurrentOp)
      } else {
        transformedOp = this.transformOperation(transformedOp, concurrentOp)
      }
    }

    return transformedOp
  }

  // Check if two operations conflict
  private conflictsWith(op1: Operation, op2: Operation): boolean {
    // Same path and different operations
    return this.pathsEqual(op1.path, op2.path) && (op1.type !== op2.type || op1.value !== op2.value)
  }

  // Transform operation based on another operation
  private transformOperation(op: Operation, otherOp: Operation): Operation {
    // Implement operational transformation logic
    switch (op.type) {
      case "insert":
        return this.transformInsert(op, otherOp)
      case "update":
        return this.transformUpdate(op, otherOp)
      case "delete":
        return this.transformDelete(op, otherOp)
      case "move":
        return this.transformMove(op, otherOp)
      default:
        return op
    }
  }

  private transformInsert(op: Operation, otherOp: Operation): Operation {
    // Adjust insert position if another operation affects the same path
    if (otherOp.type === "insert" && this.pathsEqual(op.path.slice(0, -1), otherOp.path.slice(0, -1))) {
      const opIndex = op.path[op.path.length - 1] as number
      const otherIndex = otherOp.path[otherOp.path.length - 1] as number

      if (otherIndex <= opIndex) {
        return {
          ...op,
          path: [...op.path.slice(0, -1), opIndex + 1],
        }
      }
    }

    return op
  }

  private transformUpdate(op: Operation, otherOp: Operation): Operation {
    // Update operations on same path - last one wins
    if (otherOp.type === "update" && this.pathsEqual(op.path, otherOp.path)) {
      if (otherOp.timestamp > op.timestamp) {
        // Other operation is newer, transform this one
        return {
          ...op,
          value: otherOp.value,
          previousValue: op.previousValue,
        }
      }
    }

    return op
  }

  private transformDelete(op: Operation, otherOp: Operation): Operation {
    // Handle delete transformations
    return op
  }

  private transformMove(op: Operation, otherOp: Operation): Operation {
    // Handle move transformations
    return op
  }

  private resolveConflict(op1: Operation, op2: Operation): Operation {
    // Create conflict record
    const conflict: Conflict = {
      id: `conflict_${Date.now()}`,
      operations: [op1, op2],
      resolved: false,
      timestamp: Date.now(),
    }

    this.conflicts.push(conflict)

    // Return the operation from the user with higher priority (or last writer wins)
    return op1.timestamp > op2.timestamp ? op1 : op2
  }

  private pathsEqual(path1: string[], path2: string[]): boolean {
    if (path1.length !== path2.length) return false
    return path1.every((part, index) => part === path2[index])
  }

  // Get unresolved conflicts
  getUnresolvedConflicts(): Conflict[] {
    return this.conflicts.filter((c) => !c.resolved)
  }

  // Resolve conflict manually
  resolveConflict(conflictId: string, resolution: Operation): void {
    const conflict = this.conflicts.find((c) => c.id === conflictId)
    if (conflict) {
      conflict.resolved = true
      conflict.resolution = resolution
    }
  }
}

class CollaborationEngine {
  private sessions = new Map<string, CollaborationSession>()
  private activeSessionId: string | null = null
  private users = new Map<string, User>()
  private ot = new OperationalTransformation()
  private eventListeners = new Map<string, ((event: CollaborationEvent) => void)[]>()

  // WebSocket connection for real-time sync
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor() {
    this.initializeWebSocket()
  }

  private initializeWebSocket() {
    try {
      this.ws = new WebSocket("ws://localhost:8080/collaboration")

      this.ws.onopen = () => {
        console.log("Collaboration WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        this.handleWebSocketMessage(message)
      }

      this.ws.onclose = () => {
        console.log("Collaboration WebSocket disconnected")
        this.handleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("Collaboration WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.initializeWebSocket()
      }, 1000 * this.reconnectAttempts)
    }
  }

  private handleWebSocketMessage(message: any) {
    switch (message.type) {
      case "operation":
        this.handleRemoteOperation(message.operation)
        break
      case "user-joined":
        this.handleUserJoined(message.user)
        break
      case "user-left":
        this.handleUserLeft(message.userId)
        break
      case "cursor-update":
        this.handleCursorUpdate(message.userId, message.cursor)
        break
      case "selection-update":
        this.handleSelectionUpdate(message.userId, message.selection)
        break
    }
  }

  // Session Management
  createSession(projectId: string, name: string, creator: User): string {
    const session: CollaborationSession = {
      id: `session_${Date.now()}`,
      projectId,
      name,
      users: [creator],
      activeUsers: [creator.id],
      createdAt: Date.now(),
      lastActivity: Date.now(),
      settings: {
        maxUsers: 10,
        allowAnonymous: false,
        requireApproval: false,
        autoSave: true,
        conflictResolution: "automatic",
        versionControl: true,
      },
    }

    this.sessions.set(session.id, session)
    this.activeSessionId = session.id
    this.users.set(creator.id, creator)

    return session.id
  }

  joinSession(sessionId: string, user: User): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    // Check if session is full
    if (session.activeUsers.length >= session.settings.maxUsers) {
      return false
    }

    // Check if user is already in session
    if (!session.users.find((u) => u.id === user.id)) {
      session.users.push(user)
    }

    session.activeUsers.push(user.id)
    session.lastActivity = Date.now()

    this.users.set(user.id, user)

    // Broadcast user joined event
    this.broadcastEvent({
      type: "user-joined",
      userId: user.id,
      data: user,
      timestamp: Date.now(),
    })

    return true
  }

  leaveSession(sessionId: string, userId: string): void {
    const session = this.sessions.get(sessionId)
    if (!session) return

    // Remove from active users
    session.activeUsers = session.activeUsers.filter((id) => id !== userId)
    session.lastActivity = Date.now()

    // Broadcast user left event
    this.broadcastEvent({
      type: "user-left",
      userId,
      data: { userId },
      timestamp: Date.now(),
    })
  }

  // Operation Handling
  async applyOperation(operation: Operation): Promise<void> {
    const session = this.getActiveSession()
    if (!session) throw new Error("No active collaboration session")

    // Get concurrent operations
    const concurrentOps = this.getConcurrentOperations(operation)

    // Transform operation
    const transformedOp = this.ot.transform(operation, concurrentOps)

    // Apply the operation locally
    await this.applyOperationLocally(transformedOp)

    // Broadcast to other users
    this.broadcastOperation(transformedOp)

    // Store operation for history
    this.ot.operations.push(transformedOp)
  }

  private async applyOperationLocally(operation: Operation): Promise<void> {
    // Apply operation to local project state
    // This would integrate with the project management system
    console.log("Applying operation locally:", operation)
  }

  private getConcurrentOperations(operation: Operation): Operation[] {
    // Get operations that happened after this operation's timestamp
    return this.ot.operations.filter((op) => op.timestamp > operation.timestamp && op.userId !== operation.userId)
  }

  private handleRemoteOperation(operation: Operation): void {
    // Handle operation from remote user
    this.applyOperationLocally(operation)
    this.ot.operations.push(operation)
  }

  private broadcastOperation(operation: Operation): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "operation",
          operation,
        }),
      )
    }

    // Emit local event
    this.emitEvent({
      type: "operation",
      userId: operation.userId,
      data: operation,
      timestamp: operation.timestamp,
    })
  }

  // User Presence
  updateCursor(userId: string, cursor: { x: number; y: number }): void {
    const user = this.users.get(userId)
    if (user) {
      user.cursor = { ...cursor, timestamp: Date.now() }

      // Broadcast cursor update
      this.broadcastEvent({
        type: "cursor",
        userId,
        data: cursor,
        timestamp: Date.now(),
      })
    }
  }

  updateSelection(userId: string, selection: any): void {
    const user = this.users.get(userId)
    if (user) {
      user.selection = selection

      // Broadcast selection update
      this.broadcastEvent({
        type: "selection",
        userId,
        data: selection,
        timestamp: Date.now(),
      })
    }
  }

  private handleUserJoined(user: User): void {
    this.users.set(user.id, user)
    this.emitEvent({
      type: "user-joined",
      userId: user.id,
      data: user,
      timestamp: Date.now(),
    })
  }

  private handleUserLeft(userId: string): void {
    this.users.delete(userId)
    this.emitEvent({
      type: "user-left",
      userId,
      data: { userId },
      timestamp: Date.now(),
    })
  }

  private handleCursorUpdate(userId: string, cursor: any): void {
    const user = this.users.get(userId)
    if (user) {
      user.cursor = { ...cursor, timestamp: Date.now() }
    }
  }

  private handleSelectionUpdate(userId: string, selection: any): void {
    const user = this.users.get(userId)
    if (user) {
      user.selection = selection
    }
  }

  // Event System
  on(eventType: string, callback: (event: CollaborationEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType)!.push(callback)
  }

  off(eventType: string, callback: (event: CollaborationEvent) => void): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emitEvent(event: CollaborationEvent): void {
    const listeners = this.eventListeners.get(event.type)
    if (listeners) {
      listeners.forEach((callback) => callback(event))
    }
  }

  private broadcastEvent(event: CollaborationEvent): void {
    this.emitEvent(event)

    // Send via WebSocket if connected
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event))
    }
  }

  // Getters
  getActiveSession(): CollaborationSession | null {
    return this.activeSessionId ? this.sessions.get(this.activeSessionId) || null : null
  }

  getSession(sessionId: string): CollaborationSession | null {
    return this.sessions.get(sessionId) || null
  }

  getUser(userId: string): User | null {
    return this.users.get(userId) || null
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  getUnresolvedConflicts(): Conflict[] {
    return this.ot.getUnresolvedConflicts()
  }

  resolveConflict(conflictId: string, resolution: Operation): void {
    this.ot.resolveConflict(conflictId, resolution)
  }

  // Cleanup
  dispose(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.sessions.clear()
    this.users.clear()
    this.eventListeners.clear()
  }
}

// Singleton instance
export const collaborationEngine = new CollaborationEngine()
