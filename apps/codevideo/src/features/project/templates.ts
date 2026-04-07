/**
 * CodeVideo Project Templates
 * Pre-built video composition templates for quick start
 */

export interface Template {
  id: string
  name: string
  description: string
  category: 'basic' | 'animation' | 'interactive' | 'data' | 'effects'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  code: string
  tags: string[]
}

export const TEMPLATES: Template[] = [
  {
    id: 'basic-fade',
    name: 'Basic Text Fade',
    description: 'Simple text that fades in over time',
    category: 'basic',
    difficulty: 'beginner',
    tags: ['text', 'fade', 'beginner'],
    code: `import { useFrame, Fill, interpolate } from '@rendiv/core';

export const BasicFade = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        opacity,
        color: 'white',
        fontSize: 80,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        Hello, CodeVideo!
      </h1>
    </Fill>
  );
};`
  },

  {
    id: 'spring-bounce',
    name: 'Spring Bounce Animation',
    description: 'Text that bounces with realistic physics',
    category: 'animation',
    difficulty: 'intermediate',
    tags: ['physics', 'spring', 'bounce', 'animation'],
    code: `import { useFrame, Fill, spring } from '@rendiv/core';

export const SpringBounce = () => {
  const frame = useFrame();

  const bounceY = spring({
    frame,
    fps: 30,
    config: { damping: 12, mass: 1, stiffness: 150 }
  });

  const scale = spring({
    frame: frame - 30, // Start after 1 second
    fps: 30,
    config: { damping: 15, mass: 0.8, stiffness: 200 }
  });

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        transform: \`translateY(\${200 - bounceY * 150}px) scale(\${0.5 + scale * 0.5})\`,
        color: 'white',
        fontSize: 80,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        Bounce!
      </h1>
    </Fill>
  );
};`
  },

  {
    id: 'color-transition',
    name: 'Color Transition',
    description: 'Smooth color interpolation between multiple hues',
    category: 'animation',
    difficulty: 'intermediate',
    tags: ['color', 'transition', 'interpolation'],
    code: `import { useFrame, Fill, interpolate, blendColors } from '@rendiv/core';

export const ColorTransition = () => {
  const frame = useFrame();

  // Color transition over time
  const colorProgress = interpolate(frame, [0, 60, 120, 180], [0, 0.33, 0.66, 1]);
  const backgroundColor = blendColors(colorProgress, [
    '#ff6b6b', // Red
    '#4ecdc4', // Teal
    '#45b7d1', // Blue
    '#f9ca24'  // Yellow
  ]);

  const textColor = blendColors(colorProgress, [
    '#ffffff', // White on red
    '#ffffff', // White on teal
    '#ffffff', // White on blue
    '#2d3436'  // Dark on yellow
  ]);

  return (
    <Fill style={{
      background: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.1s ease'
    }}>
      <h1 style={{
        color: textColor,
        fontSize: 80,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Color Magic!
      </h1>
    </Fill>
  );
};`
  },

  {
    id: 'particle-explosion',
    name: 'Particle Explosion',
    description: 'Animated particles bursting outward in a circle',
    category: 'effects',
    difficulty: 'advanced',
    tags: ['particles', 'physics', 'explosion', 'advanced'],
    code: `import { useFrame, Fill, interpolate, spring } from '@rendiv/core';

export const ParticleExplosion = () => {
  const frame = useFrame();

  // Create 20 particles in a circle
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const distance = interpolate(frame, [30, 120], [0, 300]);
    const particleFrame = Math.max(0, frame - 30 - i * 2);

    return {
      x: Math.cos(angle) * distance * spring({
        frame: particleFrame,
        fps: 30,
        config: { damping: 8, stiffness: 100 }
      }),
      y: Math.sin(angle) * distance * spring({
        frame: particleFrame,
        fps: 30,
        config: { damping: 8, stiffness: 100 }
      }),
      opacity: interpolate(particleFrame, [0, 45], [1, 0]),
      hue: (i / 20) * 360 // Different colors for each particle
    };
  });

  return (
    <Fill style={{
      background: '#0f0f0f',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Central explosion point */}
      {frame < 30 && (
        <div style={{
          width: 20,
          height: 20,
          background: 'white',
          borderRadius: '50%',
          boxShadow: '0 0 20px white'
        }} />
      )}

      {/* Particles */}
      {particles.map((particle, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 12,
          height: 12,
          background: \`hsl(\${particle.hue}, 80%, 60%)\`,
          borderRadius: '50%',
          transform: \`translate(\${particle.x - 6}px, \${particle.y - 6}px)\`,
          opacity: particle.opacity,
          boxShadow: \`0 0 10px hsl(\${particle.hue}, 80%, 60%)\`
        }} />
      ))}

      {/* Title */}
      <h1 style={{
        position: 'absolute',
        top: 50,
        color: 'white',
        fontSize: 60,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        opacity: interpolate(frame, [0, 30], [1, 0])
      }}>
        Get Ready...
      </h1>
    </Fill>
  );
};`
  },

  {
    id: 'interactive-choice',
    name: 'Interactive Choice',
    description: 'Video with user interaction and branching paths',
    category: 'interactive',
    difficulty: 'advanced',
    tags: ['interactive', 'branching', 'conditional', 'advanced'],
    code: `import { useFrame, Fill, interpolate } from '@rendiv/core';

export const InteractiveChoice = () => {
  const frame = useFrame();

  // Simulate user choice (in real app, this would come from user input)
  const userChoice = frame > 90 ? 'happy' : 'sad'; // Auto-demo

  const textOpacity = interpolate(frame, [60, 90], [0, 1]);
  const choiceOpacity = interpolate(frame, [30, 60], [0, 1]);

  return (
    <Fill style={{
      background: userChoice === 'happy'
        ? 'linear-gradient(45deg, #ff6b6b, #ffd93d)'
        : 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Question */}
      {frame < 60 && (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            opacity: choiceOpacity,
            color: 'white',
            fontSize: 60,
            marginBottom: 40
          }}>
            Choose Your Path:
          </h1>
          <div style={{
            opacity: choiceOpacity,
            color: 'white',
            fontSize: 40
          }}>
            Happy or Sad?
          </div>
        </div>
      )}

      {/* Outcome */}
      {frame >= 90 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 100,
            marginBottom: 20,
            opacity: textOpacity
          }}>
            {userChoice === 'happy' ? '😊' : '😢'}
          </div>
          <h1 style={{
            opacity: textOpacity,
            color: 'white',
            fontSize: 60
          }}>
            You chose {userChoice}!
          </h1>
        </div>
      )}

      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 300,
        height: 4,
        background: 'rgba(255,255,255,0.3)',
        borderRadius: 2
      }}>
        <div style={{
          width: \`\${(frame / 180) * 100}%\`,
          height: '100%',
          background: 'white',
          borderRadius: 2,
          transition: 'width 0.1s ease'
        }} />
      </div>
    </Fill>
  );
};`
  },

  {
    id: 'data-visualization',
    name: 'Data Visualization',
    description: 'Animated charts and graphs from live data',
    category: 'data',
    difficulty: 'advanced',
    tags: ['data', 'charts', 'animation', 'visualization'],
    code: `import { useFrame, Fill, interpolate } from '@rendiv/core';

export const DataVisualization = () => {
  const frame = useFrame();

  // Sample data points
  const dataPoints = [30, 70, 45, 80, 60, 90, 75, 85];

  // Animated bars
  const bars = dataPoints.map((value, index) => {
    const barFrame = Math.max(0, frame - 30 - index * 5);
    const height = interpolate(barFrame, [0, 30], [0, value * 3]);
    const opacity = interpolate(barFrame, [0, 15], [0, 1]);

    return {
      height,
      opacity,
      value,
      x: index * 60 + 100
    };
  });

  // Animated line
  const linePoints = dataPoints.map((value, index) => {
    const pointFrame = Math.max(0, frame - 60 - index * 3);
    const y = 400 - interpolate(pointFrame, [0, 20], [0, value * 3]);
    const opacity = interpolate(pointFrame, [0, 10], [0, 1]);

    return {
      x: index * 60 + 130,
      y,
      opacity
    };
  });

  return (
    <Fill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Title */}
      <h1 style={{
        position: 'absolute',
        top: 50,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: 48,
        textAlign: 'center',
        opacity: interpolate(frame, [0, 30], [0, 1])
      }}>
        Sales Data Visualization
      </h1>

      {/* Bars */}
      {bars.map((bar, index) => (
        <div key={index} style={{
          position: 'absolute',
          left: bar.x,
          bottom: 150,
          width: 40,
          height: bar.height,
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '4px 4px 0 0',
          opacity: bar.opacity,
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'center',
          paddingBottom: 8,
          color: '#333',
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          {bar.opacity > 0.8 && bar.value}
        </div>
      ))}

      {/* Line chart */}
      <svg style={{
        position: 'absolute',
        bottom: 150,
        left: 70,
        width: 500,
        height: 300
      }}>
        {/* Line */}
        <polyline
          points={linePoints.map(p => \`\${p.x - 70},\${300 - (400 - p.y) + 150}\`).join(' ')}
          stroke="white"
          strokeWidth="3"
          fill="none"
          opacity={interpolate(frame, [60, 90], [0, 1])}
        />

        {/* Points */}
        {linePoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x - 70}
            cy={300 - (400 - point.y) + 150}
            r="6"
            fill="white"
            opacity={point.opacity}
          />
        ))}
      </svg>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        right: 50,
        opacity: interpolate(frame, [120, 150], [0, 1])
      }}>
        <div style={{ color: 'white', fontSize: 14 }}>
          📊 Monthly Sales Data
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
          Animated visualization
        </div>
      </div>
    </Fill>
  );
};`
  }
]

/**
 * Get all available templates
 */
export function getAllTemplates(): Template[] {
  return TEMPLATES
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: Template['category']): Template[] {
  return TEMPLATES.filter(template => template.category === category)
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(template => template.id === id)
}

/**
 * Search templates by query
 */
export function searchTemplates(query: string): Template[] {
  const lowercaseQuery = query.toLowerCase()
  return TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}