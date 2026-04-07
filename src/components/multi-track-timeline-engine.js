/**
 * Enhanced Multi-Track Timeline Engine for Higgsfield
 *
 * Professional multi-track video editing with advanced compositing,
 * blend modes, and cross-track effects integration
 */

export const TRACK_TYPES = ["video", "audio", "text", "effect", "adjustment", "subtitle"]

export const BLEND_MODES = [
  "normal", "multiply", "screen", "overlay", "soft-light", "hard-light",
  "color-dodge", "color-burn", "difference", "exclusion", "hue",
  "saturation", "color", "luminosity"
]

export class EnhancedTrack {
  constructor(id, name, type) {
    this.id = id
    this.name = name
    this.type = type
    this.index = 0
    this.height = type === 'audio' ? 80 : 60
    this.color = this.getDefaultColor(type)
    this.locked = false
    this.muted = false
    this.solo = false
    this.volume = 1.0
    this.opacity = 1.0
    this.blendMode = 'normal'
    this.effects = []
    this.clips = []
    this.metadata = {}
  }

  getDefaultColor(type) {
    const colors = {
      video: '#3b82f6',
      audio: '#10b981',
      text: '#f59e0b',
      effect: '#8b5cf6',
      adjustment: '#ef4444',
      subtitle: '#6b7280',
    }
    return colors[type] || '#6b7280'
  }
}

export class EnhancedClip {
  constructor(id, trackId, name, startTime, duration) {
    this.id = id
    this.trackId = trackId
    this.name = name
    this.startTime = startTime
    this.endTime = startTime + duration
    this.duration = duration
    this.type = 'video' // Will be set based on track type
    this.thumbnail = null
    this.transitions = { in: null, out: null }
    this.effects = []
    this.metadata = {}
  }
}

class MultiTrackTimelineEngine {
  constructor() {
    this.tracks = []
    this.projectDuration = 60 // Default 60 seconds
    this.currentTime = 0
  }

  // Track Management
  createTrack(type, name) {
    if (!TRACK_TYPES.includes(type)) {
      throw new Error(`Invalid track type: ${type}`)
    }

    const id = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const trackName = name || `${type.charAt(0).toUpperCase() + type.slice(1)} Track ${this.tracks.length + 1}`

    const track = new EnhancedTrack(id, trackName, type)

    // Set default properties based on type
    if (type === 'audio') {
      track.height = 80
    }

    this.tracks.push(track)
    this.updateTrackIndices()

    return track
  }

  getTrack(trackId) {
    return this.tracks.find(track => track.id === trackId) || null
  }

  getTracks() {
    return [...this.tracks]
  }

  updateTrack(trackId, updates) {
    const track = this.getTrack(trackId)
    if (track) {
      Object.assign(track, updates)
      return true
    }
    return false
  }

  deleteTrack(trackId) {
    const index = this.tracks.findIndex(track => track.id === trackId)
    if (index > -1) {
      this.tracks.splice(index, 1)
      this.updateTrackIndices()
      return true
    }
    return false
  }

  moveTrack(trackId, newIndex) {
    const track = this.getTrack(trackId)
    if (!track) return false

    const currentIndex = this.tracks.indexOf(track)
    if (currentIndex === -1) return false

    // Remove from current position
    this.tracks.splice(currentIndex, 1)

    // Insert at new position
    this.tracks.splice(Math.min(newIndex, this.tracks.length), 0, track)

    this.updateTrackIndices()
    return true
  }

  updateTrackIndices() {
    this.tracks.forEach((track, index) => {
      track.index = index
    })
  }

  // Clip Management
  addClipToTrack(trackId, clipData) {
    const track = this.getTrack(trackId)
    if (!track) {
      throw new Error(`Track not found: ${trackId}`)
    }

    const id = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const clip = new EnhancedClip(
      id,
      trackId,
      clipData.name || `Clip ${track.clips.length + 1}`,
      clipData.startTime || 0,
      clipData.duration || 5
    )

    // Set clip type based on track type
    clip.type = track.type

    track.clips.push(clip)
    this.updateProjectDuration()

    return clip
  }

  getClip(clipId) {
    for (const track of this.tracks) {
      const clip = track.clips.find(c => c.id === clipId)
      if (clip) return clip
    }
    return null
  }

  updateClip(clipId, updates) {
    const clip = this.getClip(clipId)
    if (clip) {
      Object.assign(clip, updates)

      // Update end time if duration changed
      if (updates.duration !== undefined) {
        clip.endTime = clip.startTime + updates.duration
      }

      // Update duration if end time changed
      if (updates.endTime !== undefined) {
        clip.duration = updates.endTime - clip.startTime
      }

      this.updateProjectDuration()
      return true
    }
    return false
  }

  deleteClip(clipId) {
    for (const track of this.tracks) {
      const index = track.clips.findIndex(c => c.id === clipId)
      if (index > -1) {
        track.clips.splice(index, 1)
        this.updateProjectDuration()
        return true
      }
    }
    return false
  }

  moveClip(clipId, newTrackId, newStartTime) {
    const clip = this.getClip(clipId)
    if (!clip) return false

    const newTrack = this.getTrack(newTrackId)
    if (!newTrack) return false

    // Remove from old track
    const oldTrack = this.getTrack(clip.trackId)
    if (oldTrack) {
      const index = oldTrack.clips.indexOf(clip)
      if (index > -1) {
        oldTrack.clips.splice(index, 1)
      }
    }

    // Add to new track
    clip.trackId = newTrackId
    clip.startTime = newStartTime
    clip.endTime = newStartTime + clip.duration
    clip.type = newTrack.type

    newTrack.clips.push(clip)
    this.updateProjectDuration()

    return true
  }

  splitClip(clipId, splitTime) {
    const clip = this.getClip(clipId)
    if (!clip) return null

    if (splitTime <= clip.startTime || splitTime >= clip.endTime) {
      return null // Invalid split time
    }

    // Create second clip
    const secondClipId = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const secondClip = new EnhancedClip(
      secondClipId,
      clip.trackId,
      `${clip.name} (Part 2)`,
      splitTime,
      clip.endTime - splitTime
    )
    secondClip.type = clip.type
    secondClip.thumbnail = clip.thumbnail

    // Update first clip
    clip.endTime = splitTime
    clip.duration = splitTime - clip.startTime
    clip.name = `${clip.name} (Part 1)`

    // Add second clip to track
    const track = this.getTrack(clip.trackId)
    if (track) {
      track.clips.push(secondClip)
    }

    this.updateProjectDuration()

    return [clip, secondClip]
  }

  // Compositing and Rendering
  async compositeFrameAtTime(time, width, height) {
    // Simulate compositing process
    const activeClips = []

    // Find all clips active at the given time
    for (const track of this.tracks) {
      if (track.muted) continue

      for (const clip of track.clips) {
        if (time >= clip.startTime && time <= clip.endTime) {
          activeClips.push({
            clip,
            track,
            localTime: time - clip.startTime
          })
        }
      }
    }

    // Simulate rendering time
    const renderTime = Math.random() * 50 + 10

    // Simulate frame buffer (would be actual composited image)
    const frame = null

    return {
      frame,
      metadata: {
        trackCount: this.tracks.length,
        effectCount: this.tracks.reduce((sum, track) => sum + track.effects.length, 0),
        activeClipCount: activeClips.length,
        renderTime
      }
    }
  }

  // Project Management
  getProjectDuration() {
    return this.projectDuration
  }

  updateProjectDuration() {
    let maxEndTime = 0

    for (const track of this.tracks) {
      for (const clip of track.clips) {
        maxEndTime = Math.max(maxEndTime, clip.endTime)
      }
    }

    this.projectDuration = Math.max(60, maxEndTime + 10) // Minimum 60s, plus 10s padding
  }

  setCurrentTime(time) {
    this.currentTime = Math.max(0, Math.min(this.projectDuration, time))
  }

  getCurrentTime() {
    return this.currentTime
  }

  // Export/Import
  exportProject() {
    return {
      version: '1.0',
      tracks: this.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => ({ ...clip }))
      })),
      projectDuration: this.projectDuration,
      metadata: {
        exportedAt: new Date().toISOString(),
        trackCount: this.tracks.length,
        totalClips: this.tracks.reduce((sum, track) => sum + track.clips.length, 0)
      }
    }
  }

  importProject(projectData) {
    try {
      this.tracks = projectData.tracks.map(trackData => {
        const track = new EnhancedTrack(trackData.id, trackData.name, trackData.type)
        Object.assign(track, trackData)
        track.clips = trackData.clips.map(clipData => {
          const clip = new EnhancedClip(
            clipData.id,
            clipData.trackId,
            clipData.name,
            clipData.startTime,
            clipData.duration
          )
          Object.assign(clip, clipData)
          return clip
        })
        return track
      })

      this.projectDuration = projectData.projectDuration || 60
      this.currentTime = 0

      return true
    } catch (error) {
      console.error('Failed to import project:', error)
      return false
    }
  }

  // Utility Methods
  getTracksByType(type) {
    return this.tracks.filter(track => track.type === type)
  }

  getVisibleTracks() {
    return this.tracks.filter(track => !track.hidden)
  }

  getClipsAtTime(time) {
    const clips = []

    for (const track of this.tracks) {
      for (const clip of track.clips) {
        if (time >= clip.startTime && time <= clip.endTime) {
          clips.push({ clip, track, localTime: time - clip.startTime })
        }
      }
    }

    return clips
  }
}

// Singleton instance
export const multiTrackTimelineEngine = new MultiTrackTimelineEngine()