import React from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Activity,
  Crosshair,
  Palette,
  Sliders,
} from 'lucide-react';

export default function PlaybackModal({
  isOpen,
  onClose,
  frames = [],
  currentIndex = 0,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  showTrail,
  setShowTrail,
  showReticle,
  setShowReticle,
  colorMap,
  setColorMap,
  isBlinking,
}) {
  if (!isOpen) return null;

  const currentFrame = frames[currentIndex] || frames[0];

  const handleTogglePlayAndClose = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      onClose(); // Automatically close modal so user watches the sequence play!
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080D26]/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-[0_24px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] relative flex flex-col gap-5 text-[#F4F7FF]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#3D7BFF]/10 border border-[#3D7BFF]/30 text-[#3D7BFF]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-[#F4F7FF] tracking-tight">
                Playback & Timeline Controls
              </h3>
              <p className="text-xs text-[#8392C4] font-sans">
                إعدادات التشغيل الزمني والمسارات الفلكية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8392C4] hover:text-[#F4F7FF] hover:bg-[#0E163B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Frame Status Badge */}
        <div className="flex items-center justify-between bg-[#0E163B] border border-[rgba(255,255,255,0.10)] rounded-lg px-4 py-2.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#8392C4]">FRAME:</span>
            <span className="text-[#3D7BFF] font-bold">
              {currentIndex + 1} / {frames.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8392C4]">DATE:</span>
            <span className="text-[#F4F7FF] font-semibold">
              {currentFrame?.date || '—'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8392C4]">BAND:</span>
            <span className="text-[#FFC857] font-semibold">
              {currentFrame?.wavelengthUm} µm
            </span>
          </div>
        </div>

        {/* Timeline Range Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono text-[#8392C4]">
            <span>EPOCH SCRUBBER</span>
            <span className="text-[#3D7BFF] font-semibold">Epoch {currentIndex + 1}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0, frames.length - 1)}
            value={currentIndex}
            disabled={isBlinking}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="w-full accent-[#3D7BFF] cursor-pointer h-2 bg-[#080D26] rounded-lg"
          />
          {/* Epoch ticks */}
          <div className="flex justify-between px-1 text-[10px] font-mono text-[#8392C4]">
            {frames.map((f, idx) => (
              <span
                key={f.id || idx}
                onClick={() => !isBlinking && setCurrentIndex(idx)}
                className={`cursor-pointer hover:text-[#3D7BFF] transition-colors ${idx === currentIndex ? 'text-[#3D7BFF] font-bold' : ''
                  }`}
              >
                #{idx + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Playback Transport Buttons */}
        <div className="flex items-center justify-center gap-3 py-1">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + frames.length) % frames.length)}
            disabled={isBlinking}
            className="p-2.5 rounded-lg bg-[#0E163B] border border-[rgba(255,255,255,0.10)] text-[#B6C2E8] hover:text-white hover:border-[#3D7BFF]/50 disabled:opacity-40 transition-all duration-state"
            title="Previous Epoch"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlayAndClose}
            disabled={isBlinking}
            className={`px-6 py-2.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all duration-state active:scale-95 ${isPlaying
              ? 'bg-[#FFC857] text-[#080D26] hover:bg-[#ffe082]'
              : 'bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white shadow-[0_0_20px_rgba(61,123,255,0.4)]'
              }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE TIMELINE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY & CLOSE (بدء التشغيل)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % frames.length)}
            disabled={isBlinking}
            className="p-2.5 rounded-lg bg-[#0E163B] border border-[rgba(255,255,255,0.10)] text-[#B6C2E8] hover:text-white hover:border-[#3D7BFF]/50 disabled:opacity-40 transition-all duration-state"
            title="Next Epoch"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Layer Toggles */}
        <div className="border-t border-[rgba(255,255,255,0.10)] pt-4 flex flex-col gap-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8392C4]">
            VISUAL OVERLAYS & OPTICAL FILTERS
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Motion Trail Toggle (Comet Coral #FF7A59) */}
            <button
              onClick={() => setShowTrail(!showTrail)}
              className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs font-mono font-semibold transition-all duration-state ${showTrail
                ? 'border-[#FF7A59] bg-[#FF7A59]/10 text-[#FF7A59] shadow-[0_0_12px_rgba(255,122,89,0.3)]'
                : 'border-[rgba(255,255,255,0.10)] bg-[#0E163B] text-[#8392C4] hover:border-[#FF7A59]/40'
                }`}
            >
              <Activity className="w-4 h-4" />
              <span>Motion Trail (المسار)</span>
            </button>

            {/* Target Reticle Toggle (Cosmic Blue #3D7BFF) */}
            <button
              onClick={() => setShowReticle(!showReticle)}
              className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs font-mono font-semibold transition-all duration-state ${showReticle
                ? 'border-[#3D7BFF] bg-[#3D7BFF]/10 text-[#3D7BFF] shadow-[0_0_12px_rgba(61,123,255,0.3)]'
                : 'border-[rgba(255,255,255,0.10)] bg-[#0E163B] text-[#8392C4] hover:border-[#3D7BFF]/40'
                }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>Crosshair (التهديف)</span>
            </button>
          </div>

          {/* Color Palettes */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-xs font-mono text-[#8392C4] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#3D7BFF]" />
              <span>False Color:</span>
            </span>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'grayscale', label: 'Grayscale' },
                { id: 'inferno', label: 'Thermal IR' },
                { id: 'cyan', label: 'Cryo-Cyan' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorMap(c.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-state ${colorMap === c.id
                    ? 'bg-[#3D7BFF] text-white font-bold shadow-md shadow-[#3D7BFF]/30'
                    : 'bg-[#0E163B] border border-[rgba(255,255,255,0.10)] text-[#B6C2E8] hover:border-[#3D7BFF]/40'
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0E163B] hover:bg-[#080D26] border border-[rgba(255,255,255,0.10)] text-xs font-mono font-semibold text-[#F4F7FF] rounded-lg transition-colors"
          >
            Apply & Close (تطبيق)
          </button>
        </div>
      </div>
    </div>
  );
}
