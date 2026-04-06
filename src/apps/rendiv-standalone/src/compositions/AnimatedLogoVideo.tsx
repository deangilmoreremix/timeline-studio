/**
 * Complete Rendiv Video Creation Example
 * Demonstrates the full workflow from concept to rendered video
 */

// src/compositions/AnimatedLogoVideo.tsx
import { blendColors, Fill, interpolate, spring, useFrame } from "@rendiv/core"

export const AnimatedLogoVideo = () => {
  const frame = useFrame()

  // Logo entrance animation (0-60 frames)
  const logoScale = spring({
    frame: Math.max(0, frame - 15), // Start after 15 frames
    fps: 30,
    config: { damping: 12, mass: 0.8, stiffness: 180 },
  })

  const logoOpacity = interpolate(frame, [0, 15, 30], [0, 0, 1])

  // Color transition (60-120 frames)
  const colorProgress = interpolate(frame, [60, 120], [0, 1])
  const logoColor = blendColors(colorProgress, ["#ff6b6b", "#4ecdc4", "#45b7d1"])

  // Particle system (120-180 frames)
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2
    const distance = interpolate(frame, [120, 180], [0, 200])
    const particleFrame = Math.max(0, frame - 120 - i * 2)

    return {
      x:
        Math.cos(angle) *
        distance *
        spring({
          frame: particleFrame,
          fps: 30,
          config: { damping: 8, stiffness: 100 },
        }),
      y:
        Math.sin(angle) *
        distance *
        spring({
          frame: particleFrame,
          fps: 30,
          config: { damping: 8, stiffness: 100 },
        }),
      opacity: interpolate(particleFrame, [0, 30], [1, 0]),
    }
  })

  return (
    <Fill
      style={{
        background: "linear-gradient(45deg, #0f0f0f, #1a1a2e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Main Logo */}
      <div
        style={{
          fontSize: 120,
          fontWeight: "bold",
          color: logoColor,
          opacity: logoOpacity,
          transform: `scale(${0.5 + logoScale * 0.5})`,
          textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        RENDIV
      </div>

      {/* Animated Particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 8,
            height: 8,
            background: logoColor,
            borderRadius: "50%",
            transform: `translate(${particle.x - 4}px, ${particle.y - 4}px)`,
            opacity: particle.opacity,
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          fontSize: 24,
          color: "rgba(255, 255, 255, 0.7)",
          opacity: interpolate(frame, [30, 60], [0, 1]),
          textAlign: "center",
        }}
      >
        The Video Editor Built for AI
      </div>
    </Fill>
  )
}
