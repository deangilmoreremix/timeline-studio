/**
 * Advanced Color Grading System for Higgsfield
 *
 * Professional color correction with color wheels, curves, scopes, and LUTs
 */

export function ColorGradingPanel({ onApplyEffect, currentClip }) {
  const [activeTab, setActiveTab] = React.useState('wheels');
  const [colorCorrection, setColorCorrection] = React.useState({
    // Color Wheels
    lift: { r: 0, g: 0, b: 0 },
    gamma: { r: 1, g: 1, b: 1 },
    gain: { r: 1, g: 1, b: 1 },

    // Curves
    rgb: {
      red: [[0, 0], [255, 255]],
      green: [[0, 0], [255, 255]],
      blue: [[0, 0], [255, 255]],
      master: [[0, 0], [255, 255]]
    },

    // HSL
    hue: 0,
    saturation: 0,
    luminance: 0,

    // Basic Corrections
    brightness: 0,
    contrast: 0,
    exposure: 0,

    // Advanced
    temperature: 0,
    tint: 0,
    vibrance: 0,
    saturation: 0
  });

  const [scopesVisible, setScopesVisible] = React.useState(true);
  const [lut, setLut] = React.useState(null);
  const [secondaryCorrections, setSecondaryCorrections] = React.useState([]);

  const applyCorrection = () => {
    const correctionEffect = {
      id: `color-grade-${Date.now()}`,
      type: 'color-grading',
      name: 'Professional Color Grade',
      enabled: true,
      parameters: {
        ...colorCorrection,
        lut: lut,
        secondary: secondaryCorrections
      }
    };

    onApplyEffect(correctionEffect);
  };

  return (
    <div className="color-grading-panel h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">🎨 Color Grading</h2>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 text-xs rounded ${scopesVisible ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setScopesVisible(!scopesVisible)}
            >
              Scopes
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              onClick={applyCorrection}
            >
              Apply Grade
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">Professional color correction tools</p>
      </div>

      {/* Color Scopes */}
      {scopesVisible && (
        <div className="p-4 border-b border-gray-700">
          <ColorScopes currentClip={currentClip} />
        </div>
      )}

      {/* Grading Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'wheels' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('wheels')}
        >
          Color Wheels
        </button>
        <button
          className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'curves' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('curves')}
        >
          Curves
        </button>
        <button
          className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'hsl' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('hsl')}
        >
          HSL
        </button>
        <button
          className={`flex-1 px-3 py-3 text-sm font-medium ${activeTab === 'luts' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('luts')}
        >
          LUTs
        </button>
      </div>

      {/* Grading Controls */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'wheels' && (
          <ColorWheelsPanel
            correction={colorCorrection}
            onChange={setColorCorrection}
          />
        )}

        {activeTab === 'curves' && (
          <CurvesPanel
            curves={colorCorrection.rgb}
            onChange={(rgb) => setColorCorrection({...colorCorrection, rgb})}
          />
        )}

        {activeTab === 'hsl' && (
          <HSLPanel
            hsl={{hue: colorCorrection.hue, saturation: colorCorrection.saturation, luminance: colorCorrection.luminance}}
            onChange={(hsl) => setColorCorrection({...colorCorrection, ...hsl})}
          />
        )}

        {activeTab === 'luts' && (
          <LUTsPanel
            currentLut={lut}
            onLutChange={setLut}
          />
        )}
      </div>

      {/* Secondary Corrections */}
      <div className="p-4 border-t border-gray-700">
        <SecondaryCorrectionsPanel
          corrections={secondaryCorrections}
          onChange={setSecondaryCorrections}
        />
      </div>
    </div>
  );
}

// Color Wheels Component
function ColorWheelsPanel({ correction, onChange }) {
  const updateWheel = (wheel, channel, value) => {
    onChange({
      ...correction,
      [wheel]: {
        ...correction[wheel],
        [channel]: value
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Lift Wheel */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Lift (Shadows)</h3>
        <ColorWheel
          values={correction.lift}
          onChange={(channel, value) => updateWheel('lift', channel, value)}
          size={120}
        />
      </div>

      {/* Gamma Wheel */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Gamma (Midtones)</h3>
        <ColorWheel
          values={correction.gamma}
          onChange={(channel, value) => updateWheel('gamma', channel, value)}
          size={120}
        />
      </div>

      {/* Gain Wheel */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Gain (Highlights)</h3>
        <ColorWheel
          values={correction.gain}
          onChange={(channel, value) => updateWheel('gain', channel, value)}
          size={120}
        />
      </div>

      {/* Basic Corrections */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Basic Corrections</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Brightness</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={correction.brightness}
              onChange={(e) => onChange({...correction, brightness: Number(e.target.value)})}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Contrast</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={correction.contrast}
              onChange={(e) => onChange({...correction, contrast: Number(e.target.value)})}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Exposure</label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={correction.exposure}
              onChange={(e) => onChange({...correction, exposure: Number(e.target.value)})}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Vibrance</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={correction.vibrance}
              onChange={(e) => onChange({...correction, vibrance: Number(e.target.value)})}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Color Wheel Component
function ColorWheel({ values, onChange, size = 100 }) {
  const [dragging, setDragging] = React.useState(null);

  const handleMouseDown = (channel) => (e) => {
    setDragging(channel);
  };

  const handleMouseMove = React.useCallback((e) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = size / 2;
    const clampedDistance = Math.min(distance, maxDistance);

    const angle = Math.atan2(y, x);
    const normalizedX = (x / maxDistance) * 0.5;
    const normalizedY = (y / maxDistance) * 0.5;

    if (dragging === 'r') onChange('r', normalizedX);
    if (dragging === 'g') onChange('g', normalizedY);
    if (dragging === 'b') onChange('b', (normalizedX + normalizedY) / 2);
  }, [dragging, onChange, size]);

  const handleMouseUp = React.useCallback(() => {
    setDragging(null);
  }, []);

  React.useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="relative mx-auto bg-gray-800 rounded-full border border-gray-600"
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
    >
      {/* Color wheel background */}
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="16.67%" stopColor="#ffff00" />
            <stop offset="33.33%" stopColor="#00ff00" />
            <stop offset="50%" stopColor="#00ffff" />
            <stop offset="66.67%" stopColor="#0000ff" />
            <stop offset="83.33%" stopColor="#ff00ff" />
            <stop offset="100%" stopColor="#ff0000" />
          </radialGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={size/2 - 10} fill="url(#wheelGradient)" />
      </svg>

      {/* Control points */}
      <div
        className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white cursor-move"
        style={{
          left: size/2 + (values.r * size/2) - 6,
          top: size/2 - 6,
        }}
        onMouseDown={handleMouseDown('r')}
      />
      <div
        className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white cursor-move"
        style={{
          left: size/2 - 6,
          top: size/2 + (values.g * size/2) - 6,
        }}
        onMouseDown={handleMouseDown('g')}
      />
      <div
        className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-move"
        style={{
          left: size/2 + (values.b * size/2) - 6,
          top: size/2 + (values.b * size/2) - 6,
        }}
        onMouseDown={handleMouseDown('b')}
      />
    </div>
  );
}

// Curves Panel
function CurvesPanel({ curves, onChange }) {
  const [activeCurve, setActiveCurve] = React.useState('master');

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        {['master', 'red', 'green', 'blue'].map(curve => (
          <button
            key={curve}
            className={`px-3 py-1 text-xs rounded capitalize ${activeCurve === curve ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveCurve(curve)}
          >
            {curve}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <CurvesEditor
          points={curves[activeCurve]}
          color={activeCurve === 'red' ? '#ef4444' : activeCurve === 'green' ? '#22c55e' : activeCurve === 'blue' ? '#3b82f6' : '#ffffff'}
          onChange={(newPoints) => onChange({...curves, [activeCurve]: newPoints})}
        />
      </div>
    </div>
  );
}

// Curves Editor Component
function CurvesEditor({ points, color, onChange }) {
  const canvasRef = React.useRef(null);
  const [draggingPoint, setDraggingPoint] = React.useState(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw diagonal line
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();

    // Draw curve
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach(([x, y], index) => {
      const canvasX = (x / 255) * width;
      const canvasY = height - (y / 255) * height;
      if (index === 0) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    });
    ctx.stroke();

    // Draw points
    points.forEach(([x, y], index) => {
      const canvasX = (x / 255) * width;
      const canvasY = height - (y / 255) * height;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [points, color]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imageX = (x / canvas.width) * 255;
    const imageY = 255 - (y / canvas.height) * 255;

    // Find closest point or add new point
    let closestIndex = -1;
    let closestDistance = Infinity;

    points.forEach(([px, py], index) => {
      const distance = Math.sqrt((px - imageX) ** 2 + (py - imageY) ** 2);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestDistance < 20) {
      setDraggingPoint(closestIndex);
    } else {
      // Add new point
      const newPoints = [...points, [imageX, imageY]].sort((a, b) => a[0] - b[0]);
      onChange(newPoints);
    }
  };

  const handleMouseMove = React.useCallback((e) => {
    if (draggingPoint === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(canvas.height, e.clientY - rect.top));

    const imageX = (x / canvas.width) * 255;
    const imageY = 255 - (y / canvas.height) * 255;

    const newPoints = [...points];
    newPoints[draggingPoint] = [imageX, imageY];
    onChange(newPoints);
  }, [draggingPoint, points, onChange]);

  const handleMouseUp = React.useCallback(() => {
    setDraggingPoint(null);
  }, []);

  React.useEffect(() => {
    if (draggingPoint !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingPoint, handleMouseMove, handleMouseUp]);

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="border border-gray-600 rounded cursor-crosshair"
        onClick={handleCanvasClick}
      />
      <div className="flex gap-2">
        <button
          className="px-2 py-1 bg-red-600 text-white text-xs rounded"
          onClick={() => onChange([[0, 0], [255, 255]])}
        >
          Reset
        </button>
        <button
          className="px-2 py-1 bg-gray-600 text-white text-xs rounded"
          onClick={() => onChange(points.slice(0, -1))}
        >
          Remove Point
        </button>
      </div>
    </div>
  );
}

// HSL Panel
function HSLPanel({ hsl, onChange }) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Hue</label>
        <input
          type="range"
          min="-180"
          max="180"
          value={hsl.hue}
          onChange={(e) => onChange({ ...hsl, hue: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-400 mt-1">{hsl.hue}°</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Saturation</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={hsl.saturation}
          onChange={(e) => onChange({ ...hsl, saturation: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-400 mt-1">{hsl.saturation}%</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Luminance</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={hsl.luminance}
          onChange={(e) => onChange({ ...hsl, luminance: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-400 mt-1">{hsl.luminance}%</div>
      </div>
    </div>
  );
}

// LUTs Panel
function LUTsPanel({ currentLut, onLutChange }) {
  const [luts, setLuts] = React.useState([
    { name: 'Cinema', file: 'cinema.cube' },
    { name: 'Technicolor', file: 'technicolor.cube' },
    { name: 'Vintage Film', file: 'vintage.cube' },
    { name: 'Cool Blue', file: 'cool-blue.cube' },
    { name: 'Warm Golden', file: 'warm-golden.cube' }
  ]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-3">LUT Library</h3>
        <div className="grid grid-cols-2 gap-2">
          {luts.map((lut, index) => (
            <button
              key={index}
              className={`p-3 rounded-lg border text-left hover:bg-gray-700 ${currentLut === lut ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600'}`}
              onClick={() => onLutChange(lut)}
            >
              <div className="text-sm font-medium text-white">{lut.name}</div>
              <div className="text-xs text-gray-400">{lut.file}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <button className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
          Upload Custom LUT
        </button>
      </div>

      {currentLut && (
        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2">Active LUT</h4>
          <div className="text-sm text-gray-300">{currentLut.name}</div>
          <button
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            onClick={() => onLutChange(null)}
          >
            Remove LUT
          </button>
        </div>
      )}
    </div>
  );
}

// Color Scopes Component
function ColorScopes({ currentClip }) {
  const [activeScope, setActiveScope] = React.useState('waveform');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {['waveform', 'vectorscope', 'histogram'].map(scope => (
          <button
            key={scope}
            className={`px-3 py-1 text-xs rounded capitalize ${activeScope === scope ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveScope(scope)}
          >
            {scope}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-3 h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm text-gray-400 capitalize">{activeScope} Scope</div>
          <div className="text-xs text-gray-500 mt-1">Real-time analysis would be displayed here</div>
        </div>
      </div>
    </div>
  );
}

// Secondary Corrections Panel
function SecondaryCorrectionsPanel({ corrections, onChange }) {
  const addCorrection = () => {
    const newCorrection = {
      id: `secondary-${Date.now()}`,
      name: 'Secondary Correction',
      enabled: true,
      mask: { type: 'luminance', range: [0, 255] },
      correction: {
        lift: { r: 0, g: 0, b: 0 },
        gamma: { r: 1, g: 1, b: 1 },
        gain: { r: 1, g: 1, b: 1 }
      }
    };
    onChange([...corrections, newCorrection]);
  };

  const updateCorrection = (id, updates) => {
    onChange(corrections.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCorrection = (id) => {
    onChange(corrections.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Secondary Corrections</h3>
        <button
          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          onClick={addCorrection}
        >
          Add
        </button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {corrections.map(correction => (
          <div key={correction.id} className="bg-gray-800 rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white">{correction.name}</span>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  checked={correction.enabled}
                  onChange={(e) => updateCorrection(correction.id, { enabled: e.target.checked })}
                  className="rounded"
                />
                <button
                  className="text-red-400 hover:text-red-300 text-xs"
                  onClick={() => removeCorrection(correction.id)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Mask: {correction.mask.type} | Range: {correction.mask.range[0]}-{correction.mask.range[1]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}