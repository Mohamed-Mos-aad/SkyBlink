import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Compass,
  Footprints,
  Palette,
} from 'lucide-react';

export default function TimeSlider({
  frames = [],
  currentIndex,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  showTrail,
  setShowTrail,
  showReticle,
  setShowReticle,
  colorMap,
  setColorMap,
  disabled = false,
}) {
  const currentFrame = frames[currentIndex];

  // Auto-play interval loop
  useEffect(() => {
    if (!isPlaying || disabled || frames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length, disabled, setCurrentIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % frames.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + frames.length) % frames.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [frames.length, disabled, setCurrentIndex, setIsPlaying]);

  return (
    <div className="bg-space-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-lg flex flex-col gap-3">
      {/* Playback Controls & Frame Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + frames.length) % frames.length)
            }
            disabled={disabled}
            className="p-1.5 rounded-lg bg-space-950 border border-slate-800 text-slate-300 hover:text-cyanAccent hover:border-cyanAccent/50 active:scale-95 transition-all"
            title="Previous Epoch (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                : 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700'
            }`}
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>PLAY</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % frames.length)}
            disabled={disabled}
            className="p-1.5 rounded-lg bg-space-950 border border-slate-800 text-slate-300 hover:text-cyanAccent hover:border-cyanAccent/50 active:scale-95 transition-all"
            title="Next Epoch (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Current Frame Status Badge */}
        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">EPOCH: </span>
          <span className="text-cyanAccent font-bold">
            {currentIndex + 1} / {frames.length}
          </span>
        </div>
      </div>

      {/* Scrubbing Range Slider */}
      <div className="flex flex-col gap-1.5">
        <input
          type="range"
          min="0"
          max={frames.length - 1}
          value={currentIndex}
          disabled={disabled}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentIndex(Number(e.target.value));
          }}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyanAccent focus:outline-none"
        />

        {/* Date ticks below slider */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
          {frames.map((f, idx) => (
            <span
              key={f.id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`cursor-pointer hover:text-cyanAccent transition-colors ${
                idx === currentIndex ? 'text-cyanAccent font-bold' : ''
              }`}
            >
              {f.date.slice(5)} {/* MM-DD */}
            </span>
          ))}
        </div>
      </div>

      {/* Toggle View Options (Trail, Reticle, False-Color) */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        {/* Trail Toggle */}
        <button
          onClick={() => setShowTrail(!showTrail)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
            showTrail
              ? 'bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Motion Trail"
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>TRAIL</span>
        </button>

        {/* Reticle Toggle */}
        <button
          onClick={() => setShowReticle(!showReticle)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
            showReticle
              ? 'bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Celestial Grid Crosshair"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>RETICLE</span>
        </button>

        {/* Color Palette Toggle */}
        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          <Palette className="w-3 h-3 text-slate-400 ml-1" />
          <button
            onClick={() => setColorMap('grayscale')}
            className={`px-1.5 py-0.5 rounded ${
              colorMap === 'grayscale' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
            }`}
          >
            GRAY
          </button>
          <button
            onClick={() => setColorMap('inferno')}
            className={`px-1.5 py-0.5 rounded ${
              colorMap === 'inferno' ? 'bg-amber-600/50 text-amber-200 font-bold' : 'text-slate-400'
            }`}
          >
            INFERNO
          </button>
          <button
            onClick={() => setColorMap('cyan')}
            className={`px-1.5 py-0.5 rounded ${
              colorMap === 'cyan' ? 'bg-cyan-600/50 text-cyan-200 font-bold' : 'text-slate-400'
            }`}
          >
            CRYO
          </button>
        </div>
      </div>
    </div>
  );
}
