import React, { useState } from 'react';
import { Compass, MapPin, Search, Loader2 } from 'lucide-react';
import { resolveCelestialCoordinates } from '../services/skyblinkApi';

export default function SkyPicker({
  targets = [],
  selectedTargetId,
  onSelectTarget,
  onClose,
}) {
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolveFeedback, setResolveFeedback] = useState(null);

  // Convert RA (0..360) and Dec (-90..90) to 2D SVG canvas percentages
  const coordsToSvg = (ra, dec) => {
    const x = (ra / 360) * 100;
    const y = ((90 - dec) / 180) * 100;
    return { x, y };
  };

  // Live coordinate & name resolution using the new /api/search/resolve endpoint
  const handleResolver = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsResolving(true);
    setResolveFeedback(null);

    try {
      // Check if user entered numbers "RA, Dec" e.g. "156.09, -41.64"
      const parts = searchQuery.split(',').map((p) => parseFloat(p.trim()));
      let payload;
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        payload = { ra: parts[0], dec: parts[1] };
      } else {
        payload = { query: searchQuery.trim() };
      }

      const result = await resolveCelestialCoordinates(payload);

      if (result && result.status === 'resolved') {
        setResolveFeedback({
          success: true,
          message: `Resolved: ${result.name} (RA ${result.ra.toFixed(2)}°, Dec ${result.dec.toFixed(2)}°)`,
        });

        // Check if already in targets
        const existing = targets.find(
          (t) =>
            t.name.toLowerCase().includes(result.name.toLowerCase()) ||
            (Math.abs(t.ra - result.ra) < 0.5 && Math.abs(t.dec - result.dec) < 0.5)
        );

        if (existing) {
          onSelectTarget(existing.id);
        } else {
          // Select default first
          if (targets[0]) onSelectTarget(targets[0].id);
        }
      } else {
        // Local fallback matching
        const match = targets.find((t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
        if (match) {
          onSelectTarget(match.id);
          setResolveFeedback({ success: true, message: `Matched target: ${match.name}` });
        } else {
          setResolveFeedback({
            success: false,
            message: 'Could not resolve celestial object. Try a known star or comet name.',
          });
        }
      }
    } catch (err) {
      setResolveFeedback({ success: false, message: 'Resolver service currently offline.' });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="bg-[#0E163B] border border-[rgba(255,255,255,0.10)] rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 font-sans text-[#F4F7FF]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#3D7BFF]" />
          <div>
            <h3 className="text-base font-display font-bold text-[#F4F7FF] uppercase tracking-wider">
              Celestial Sphere & Sky Map (خريطة قبة السماء)
            </h3>
            <p className="text-[11px] text-[#8392C4] font-mono">
              Equatorial Coordinate Grid (RA / Dec) • NASA SPHEREx All-Sky Survey
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs font-mono text-[#8392C4] hover:text-[#F4F7FF] transition-colors"
        >
          Close Sky Map
        </button>
      </div>

      {/* Resolver Search Bar (Connects to /api/search/resolve) */}
      <form onSubmit={handleResolver} className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-4 h-4 text-[#8392C4] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Resolve any celestial name (e.g. Betelgeuse, Halley, or 156.09, -41.64)..."
            className="w-full bg-[#080D26] border border-[rgba(255,255,255,0.10)] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[#F4F7FF] placeholder-[#8392C4] outline-none focus:border-[#3D7BFF] transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isResolving}
          className="w-full sm:w-auto px-4 py-2 bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white text-xs font-mono font-bold rounded-lg transition-all duration-state flex items-center justify-center gap-1.5 shadow-cosmic-glow disabled:opacity-50"
        >
          {isResolving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Resolve via CDS / SIMBAD</span>
        </button>
      </form>

      {/* Resolver Feedback */}
      {resolveFeedback && (
        <div
          className={`px-3 py-1.5 rounded text-xs font-mono ${
            resolveFeedback.success
              ? 'bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/30'
              : 'bg-[#FF7A59]/15 text-[#FF7A59] border border-[#FF7A59]/30'
          }`}
        >
          {resolveFeedback.message}
        </div>
      )}

      {/* Interactive 2D Sky Projection Map */}
      <div className="relative w-full aspect-[2/1] bg-[#080D26] rounded-lg border border-[rgba(255,255,255,0.10)] overflow-hidden select-none">
        {/* Background Star Dots (Simulated Milky Way field) */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, rgba(61, 123, 255, 0.20) 0%, rgba(14, 22, 59, 0.4) 50%, transparent 80%)',
          }}
        />

        {/* SVG Celestial Grid & Target Markers */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Declination parallel lines */}
          {[-60, -30, 0, 30, 60].map((decVal) => {
            const y = ((90 - decVal) / 180) * 100;
            return (
              <g key={decVal}>
                <line
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke={decVal === 0 ? 'rgba(61, 123, 255, 0.5)' : 'rgba(255, 255, 255, 0.10)'}
                  strokeWidth={decVal === 0 ? '0.4' : '0.2'}
                  strokeDasharray={decVal === 0 ? 'none' : '1, 1'}
                />
                <text
                  x="1"
                  y={y - 1}
                  fill="rgba(182, 194, 232, 0.5)"
                  fontSize="2.2"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {decVal > 0 ? `+${decVal}°` : `${decVal}°`}
                </text>
              </g>
            );
          })}

          {/* Right Ascension hour lines */}
          {[60, 120, 180, 240, 300].map((raVal) => {
            const x = (raVal / 360) * 100;
            return (
              <g key={raVal}>
                <line
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="100"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="0.2"
                  strokeDasharray="1, 1"
                />
                <text
                  x={x + 0.5}
                  y="98"
                  fill="rgba(182, 194, 232, 0.5)"
                  fontSize="2"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {raVal}°
                </text>
              </g>
            );
          })}

          {/* Celestial Equator Highlight (0° Dec) */}
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="rgba(61, 123, 255, 0.6)"
            strokeWidth="0.4"
          />

          {/* Target Plot Markers */}
          {targets.map((t) => {
            const pos = coordsToSvg(t.ra, t.dec);
            const isSelected = t.id === selectedTargetId;
            const isHovered = hoveredTarget === t.id;

            return (
              <g
                key={t.id}
                onClick={() => onSelectTarget(t.id)}
                onMouseEnter={() => setHoveredTarget(t.id)}
                onMouseLeave={() => setHoveredTarget(null)}
                className="cursor-pointer"
              >
                {/* Ping ring if selected */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="none"
                    stroke="#FF7A59"
                    strokeWidth="0.5"
                    className="animate-ping origin-center"
                    style={{ animationDuration: '2s' }}
                  />
                )}

                {/* Target Dot (Comet Coral for moving bodies) */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected || isHovered ? '2.5' : '1.8'}
                  fill={isSelected ? '#FF7A59' : '#3D7BFF'}
                  stroke="#F4F7FF"
                  strokeWidth="0.4"
                  className="transition-all duration-state"
                />

                {/* Name Label */}
                <text
                  x={pos.x + 3}
                  y={pos.y + 1}
                  fill={isSelected ? '#FF7A59' : '#F4F7FF'}
                  fontSize="2.4"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                >
                  {t.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-2 bg-[#0E163B]/90 border border-[rgba(255,255,255,0.10)] px-2.5 py-1 rounded text-[10px] font-mono text-[#8392C4] backdrop-blur-md flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF7A59]" />
            <span>Selected Target</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3D7BFF]" />
            <span>Catalog Target</span>
          </span>
        </div>
      </div>

      {/* Target Preview Details Card */}
      <div className="bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-lg p-3 text-xs font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#FF7A59]" />
          <span className="text-[#B6C2E8]">
            Selected:{' '}
            <strong className="text-[#F4F7FF]">
              {targets.find((t) => t.id === selectedTargetId)?.name}
            </strong>
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-md bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white font-bold transition-all duration-state shadow-cosmic-glow"
        >
          View in Telescope
        </button>
      </div>
    </div>
  );
}
