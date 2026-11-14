import React from 'react';

export default function TrailOverlay({
  frames = [],
  currentIndex = 0,
  showTrail = true,
  showReticle = false,
  targetName = '',
}) {
  const currentFrame = frames[currentIndex];
  if (!currentFrame || !currentFrame.object) return null;

  // Collect historical positions up to current frame
  const historyPoints = frames.slice(0, currentIndex + 1).map((f) => ({
    x: f.object.x * 100, // percentage
    y: f.object.y * 100,
    date: f.date,
  }));

  const currentPos = {
    x: currentFrame.object.x * 100,
    y: currentFrame.object.y * 100,
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Optional Reticle / Optical Telescope Crosshair */}
      {showReticle && (
        <g stroke="rgba(61, 123, 255, 0.35)" strokeWidth="0.3" strokeDasharray="1,1">
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
          <circle cx="50" cy="50" r="25" fill="none" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="0.25" />
        </g>
      )}

      {/* Kinetic Velocity Trail Line (Exclusively Comet Coral #FF7A59) */}
      {showTrail && historyPoints.length > 1 && (
        <polyline
          fill="none"
          stroke="#FF7A59"
          strokeWidth="0.8"
          strokeDasharray="1.5, 1"
          strokeOpacity="0.9"
          points={historyPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        />
      )}

      {/* Historical Waypoints: Real Data #3DDC97 & Active Comet Coral #FF7A59 */}
      {showTrail &&
        historyPoints.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="1.0"
            fill={idx === currentIndex ? '#FF7A59' : '#3DDC97'}
            stroke="#080D26"
            strokeWidth="0.3"
          />
        ))}

      {/* Kinetic Object Marker (Pulsing Moving Body in Comet Coral #FF7A59) */}
      <g transform={`translate(${currentPos.x}, ${currentPos.y})`}>
        {/* Pulsing ring */}
        <circle
          cx="0"
          cy="0"
          r="4.5"
          fill="none"
          stroke="#FF7A59"
          strokeWidth="0.6"
          className="animate-ping origin-center"
          style={{ animationDuration: '2s' }}
        />
        {/* Target outer ring */}
        <circle cx="0" cy="0" r="3" fill="none" stroke="#FF7A59" strokeWidth="0.75" />
        {/* Center dot */}
        <circle cx="0" cy="0" r="0.8" fill="#F4F7FF" />
        {/* Corner alignment brackets */}
        <path
          d="M -4 -2 L -4 -4 L -2 -4 M 2 -4 L 4 -4 L 4 -2 M 4 2 L 4 4 L 2 4 M -2 4 L -4 4 L -4 2"
          fill="none"
          stroke="#3D7BFF"
          strokeWidth="0.45"
        />
        {/* Label badge */}
        <text
          x="5"
          y="-3"
          fill="#F4F7FF"
          fontSize="2.4"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="bold"
          className="select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"
        >
          {targetName ? targetName.split(' ')[0] : 'OBJECT'}
        </text>
      </g>
    </svg>
  );
}
