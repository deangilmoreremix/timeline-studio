/**
 * Collaboration Panel Component
 *
 * UI for managing real-time collaborative editing sessions
 */

import { MessageCircle, UserPlus, Users, Video, VideoOff } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { type CollaborationSession, collaborationEngine, type User } from "../services/collaboration-engine"

interface CollaborationPanelProps {
  className?: string
  currentUser: User
}

export function CollaborationPanel({ className, currentUser }: CollaborationPanelProps) {
  const [activeSession, setActiveSession] = useState<CollaborationSession | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [unresolvedConflicts, setUnresolvedConflicts] = useState<any[]>([])
  const [sessionName, setSessionName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  // Load collaboration state
  useEffect(() => {
    const session = collaborationEngine.getActiveSession()
    setActiveSession(session)
    setAllUsers(collaborationEngine.getAllUsers())
    setUnresolvedConflicts(collaborationEngine.getUnresolvedConflicts())

    // Listen for collaboration events
    const handleUserJoined = (event: any) => {
      setAllUsers(collaborationEngine.getAllUsers())
      setActiveSession(collaborationEngine.getActiveSession())
    }

    const handleUserLeft = (event: any) => {
      setAllUsers(collaborationEngine.getAllUsers())
      setActiveSession(collaborationEngine.getActiveSession())
    }

    const handleOperation = (event: any) => {
      setUnresolvedConflicts(collaborationEngine.getUnresolvedConflicts())
    }

    collaborationEngine.on("user-joined", handleUserJoined)
    collaborationEngine.on("user-left", handleUserLeft)
    collaborationEngine.on("operation", handleOperation)

    return () => {
      collaborationEngine.off("user-joined", handleUserJoined)
      collaborationEngine.off("user-left", handleUserLeft)
      collaborationEngine.off("operation", handleOperation)
    }
  }, [])

  const handleCreateSession = useCallback(() => {
    if (!sessionName.trim()) return

    const sessionId = collaborationEngine.createSession(
      `project_${Date.now()}`, // Would come from actual project
      sessionName,
      currentUser,
    )

    setActiveSession(collaborationEngine.getSession(sessionId))
    setSessionName("")
  }, [sessionName, currentUser])

  const handleJoinSession = useCallback(
    (sessionId: string) => {
      const success = collaborationEngine.joinSession(sessionId, currentUser)
      if (success) {
        setActiveSession(collaborationEngine.getSession(sessionId))
      }
    },
    [currentUser],
  )

  const handleLeaveSession = useCallback(() => {
    if (activeSession) {
      collaborationEngine.leaveSession(activeSession.id, currentUser.id)
      setActiveSession(null)
    }
  }, [activeSession, currentUser.id])

  const handleInviteUser = useCallback(() => {
    if (!inviteEmail.trim() || !activeSession) return

    // In a real implementation, this would send an email invitation
    console.log(`Inviting ${inviteEmail} to session ${activeSession.id}`)
    setInviteEmail("")
  }, [inviteEmail, activeSession])

  const handleToggleRecording = useCallback(() => {
    setIsRecording(!isRecording)
    // In a real implementation, this would start/stop session recording
  }, [isRecording])

  const getUserStatusColor = (user: User) => {
    if (activeSession?.activeUsers.includes(user.id)) {
      return user.id === currentUser.id ? "default" : "secondary"
    }
    return "outline"
  }

  const getUserStatusText = (user: User) => {
    if (activeSession?.activeUsers.includes(user.id)) {
      return user.id === currentUser.id ? "You" : "Active"
    }
    return "Offline"
  }

  return (
    <div className={`collaboration-panel h-full flex flex-col bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">Collaboration</h2>
          <p className="text-sm text-muted-foreground">Real-time multi-user editing</p>
        </div>

        <div className="flex items-center gap-2">
          {activeSession && (
            <Button variant={isRecording ? "destructive" : "outline"} size="sm" onClick={handleToggleRecording}>
              {isRecording ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              {isRecording ? "Stop" : "Record"}
            </Button>
          )}

          {!activeSession ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  New Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Collaboration Session</DialogTitle>
                  <DialogDescription>Start a new collaborative editing session</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="session-name">Session Name</Label>
                    <Input
                      id="session-name"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      placeholder="My Collaboration Session"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto-save" defaultChecked />
                    <Label htmlFor="auto-save">Auto-save changes</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="version-control" defaultChecked />
                    <Label htmlFor="version-control">Enable version control</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSessionName("")}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSession}>Create Session</Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLeaveSession}>
              Leave Session
            </Button>
          )}
        </div>
      </div>

      {/* Active Session Info */}
      {activeSession && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{activeSession.name}</h3>
              <p className="text-sm text-muted-foreground">{activeSession.activeUsers.length} active users</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {activeSession.activeUsers.length}/{activeSession.settings.maxUsers}
              </Badge>

              {unresolvedConflicts.length > 0 && (
                <Badge variant="destructive">{unresolvedConflicts.length} conflicts</Badge>
              )}
            </div>
          </div>

          {/* Invite Users */}
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Invite by email..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={handleInviteUser}>
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Users Panel */}
          <div className="border-r border-border p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users ({allUsers.length})
            </h3>

            <ScrollArea className="h-full">
              <div className="space-y-2">
                {allUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <Badge variant={getUserStatusColor(user)} className="text-xs">
                        {getUserStatusText(user)}
                      </Badge>
                    </div>

                    {user.cursor && <div className="text-xs text-muted-foreground">Cursor active</div>}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Activity Feed */}
          <div className="border-r border-border p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Activity
            </h3>

            <ScrollArea className="h-full">
              <div className="space-y-3">
                {/* Placeholder activity items */}
                <div className="p-3 border border-border rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Alice</span> added a new clip to Video Track 1
                  </p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>

                <div className="p-3 border border-border rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Bob</span> adjusted audio levels on Track 2
                  </p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>

                <div className="p-3 border border-border rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Charlie</span> applied color grading to Clip 3
                  </p>
                  <p className="text-xs text-muted-foreground">8 minutes ago</p>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Conflicts & Issues */}
          <div className="p-4">
            <h3 className="font-medium mb-3">Issues</h3>

            <ScrollArea className="h-full">
              <div className="space-y-3">
                {unresolvedConflicts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-sm">No conflicts or issues</p>
                    <p className="text-xs mt-1">All changes are in sync</p>
                  </div>
                ) : (
                  unresolvedConflicts.map((conflict) => (
                    <Card key={conflict.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Edit Conflict</CardTitle>
                        <CardDescription className="text-xs">Multiple users edited the same element</CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {conflict.operations.map((op, index) => (
                            <div key={index} className="text-xs p-2 bg-muted rounded">
                              <p className="font-medium">{op.userId}</p>
                              <p className="text-muted-foreground">
                                {op.type} operation at {op.path.join(".")}
                              </p>
                            </div>
                          ))}

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              Keep Latest
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              Manual Resolve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Session Status Footer */}
      {activeSession && (
        <div className="border-t border-border p-3 bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>Session: {activeSession.name}</span>
              <span>Started: {new Date(activeSession.createdAt).toLocaleTimeString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
