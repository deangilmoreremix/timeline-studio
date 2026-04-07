/**
 * Clip Editor Component for Higgsfield
 *
 * Modal editor for individual clips with properties and effects
 */

import React, { useState } from 'react'

const TRANSITIONS = [
  { value: "fade", label: "Fade" },
  { value: "wipe", label: "Wipe" },
  { value: "slide", label: "Slide" },
  { value: "scale", label: "Scale" },
  { value: "rotate", label: "Rotate" },
]

const EFFECTS = [
  { value: "blur", label: "Blur" },
  { value: "brightness", label: "Brightness" },
  { value: "contrast", label: "Contrast" },
  { value: "saturation", label: "Saturation" },
  { value: "hue", label: "Hue" },
]

export function ClipEditor({ clip, onClose, onUpdate }) {
  const [name, setName] = useState(clip.name || "")
  const [startTime, setStartTime] = useState(clip.startTime?.toString() || "0")
  const [duration, setDuration] = useState(clip.duration?.toString() || "5")
  const [inTransition, setInTransition] = useState(clip.transitions?.in || "")
  const [outTransition, setOutTransition] = useState(clip.transitions?.out || "")
  const [effects, setEffects] = useState(clip.effects || [])

  const handleSave = () => {
    onUpdate({
      name,
      startTime: Number.parseFloat(startTime),
      duration: Number.parseFloat(duration),
      transitions: {
        in: inTransition,
        out: outTransition,
      },
      effects,
    })
    onClose()
  }

  const addEffect = (effectType) => {
    const newEffect = {
      id: `effect_${Date.now()}`,
      type: effectType,
      name: EFFECTS.find(e => e.value === effectType)?.label || effectType,
      enabled: true,
      parameters: { value: 0.5 }, // Default value
    }
    setEffects([...effects, newEffect])
  }

  const updateEffect = (effectId, value) => {
    setEffects(effects.map(effect =>
      effect.id === effectId
        ? { ...effect, parameters: { ...effect.parameters, value } }
        : effect
    ))
  }

  const removeEffect = (effectId) => {
    setEffects(effects.filter(effect => effect.id !== effectId))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Edit Clip: {clip.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Properties */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Clip Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter clip name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time (seconds)</label>
                <input
                  type="number"
                  step="0.1"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (seconds)</label>
              <input
                type="number"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {clip.thumbnail && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail</label>
                <div className="border border-gray-600 rounded-lg overflow-hidden max-w-xs">
                  <img
                    src={clip.thumbnail}
                    alt={clip.name}
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Transitions */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Transitions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">In Transition</label>
                  <select
                    value={inTransition}
                    onChange={(e) => setInTransition(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">None</option>
                    {TRANSITIONS.map((transition) => (
                      <option key={transition.value} value={transition.value}>
                        {transition.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Out Transition</label>
                  <select
                    value={outTransition}
                    onChange={(e) => setOutTransition(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">None</option>
                    {TRANSITIONS.map((transition) => (
                      <option key={transition.value} value={transition.value}>
                        {transition.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Effects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Effects ({effects.length})</h3>
                <select
                  onChange={(e) => e.target.value && addEffect(e.target.value)}
                  defaultValue=""
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:outline-none text-sm"
                >
                  <option value="">Add Effect...</option>
                  {EFFECTS.map((effect) => (
                    <option key={effect.value} value={effect.value}>
                      {effect.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {effects.map((effect) => (
                  <div key={effect.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white">{effect.name}</h4>
                        <p className="text-sm text-gray-400">{effect.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <input
                            type="checkbox"
                            checked={effect.enabled}
                            onChange={(e) => {
                              const updatedEffects = effects.map(e =>
                                e.id === effect.id ? { ...e, enabled: e.target.checked } : e
                              )
                              setEffects(updatedEffects)
                            }}
                            className="rounded border-gray-600"
                          />
                          Enabled
                        </label>
                        <button
                          onClick={() => removeEffect(effect.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Intensity: {(effect.parameters?.value * 100 || 0).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={effect.parameters?.value || 0.5}
                        onChange={(e) => updateEffect(effect.id, Number.parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                ))}

                {effects.length === 0 && (
                  <div className="text-center text-gray-500 py-8 border border-gray-600 rounded-lg border-dashed">
                    <p className="text-sm">No effects added yet</p>
                    <p className="text-xs mt-1">Use the dropdown above to add effects to your clip</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}