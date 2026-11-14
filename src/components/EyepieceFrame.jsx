import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sliders,
  Zap,
  Maximize2,
  Minimize2,
  RotateCcw,
  Share2,
  Play,
  Pause,
  EyeOff,
  Settings,
} from 'lucide-react';
import FrameViewer from './FrameViewer';

export default function EyepieceFrame({
  target,
  currentIndex = 0,
  isBlinking = false,
  setIsBlinking,
  blinkFrameA = 0,
  blinkFrameB = 1,
  activeBlinkSlot = 'A',
  showTrail = true,
  showReticle = false,
  colorMap = 'grayscale',
  isPlaying = false,
  setIsPlaying,
  onOpenPlaybackModal,
  onOpenBlinkModal,
  onOpenShareModal,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isApertureMode, setIsApertureMode] = useState(true);

  const currentFrame = target?.frames?.[currentIndex] || target?.frames?.[0];
  const activeFrame = isBlinking
    ? target?.frames?.[activeBlinkSlot === 'A' ? blinkFrameA : blinkFrameB]
    : currentFrame;

  const handleZoomIn = () => setZoom((z) => Math.min(4, +(z + 0.35).toFixed(2)));
  const handleZoomOut = () => {
    setZoom((z) => {
      const nextZ = Math.max(1, +(z - 0.35).toFixed(2));
      if (nextZ === 1) setPan({ x: 0, y: 0 });
      return nextZ;
    });
  };

  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 font-sans overflow-hidden">
      {/* =========================================================================
          TOP TELEMETRY HUD BAR (Cinematic Observatory Modernism Surface)
         ========================================================================= */}
      <div className="w-full bg-[#0E163B] border border-[rgba(255,255,255,0.10)] rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg flex flex-wrap items-center justify-between gap-2 text-xs font-mono flex-shrink-0">
        {/* Left Side: Target Identification & Coordinates */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isBlinking
                  ? 'bg-[#FF7A59] shadow-[0_0_10px_#FF7A59] animate-pulse'
                  : 'bg-[#3D7BFF] shadow-[0_0_10px_#3D7BFF] animate-pulse'
              }`}
            />
            <h1 className="font-display font-bold text-sm sm:text-base text-[#F4F7FF] tracking-tight">
              {target?.fullName || target?.name || 'TARGET TELEMETRY'}
            </h1>
          </div>

          <div className="h-4 w-px bg-[rgba(255,255,255,0.10)] hidden sm:block" />

          <div className="flex items-center gap-2.5 text-[#B6C2E8]">
            <span>
              RA:{' '}
              <span className="text-[#3D7BFF] font-semibold">
                {typeof target?.ra === 'number' ? target.ra.toFixed(2) : target?.ra}°
              </span>
            </span>
            <span className="text-[#8392C4]/40">|</span>
            <span>
              Dec:{' '}
              <span className="text-[#3D7BFF] font-semibold">
                {typeof target?.dec === 'number'
                  ? target.dec >= 0
                    ? `+${target.dec.toFixed(2)}`
                    : target.dec.toFixed(2)
                  : target?.dec}°
              </span>
            </span>
            <span className="text-[#8392C4]/40">|</span>
            <span>
              FOV:{' '}
              <span className="text-[#3DDC97] font-semibold">
                {target?.sizeDeg || 0.1}°
              </span>
            </span>
          </div>
        </div>

        {/* Right Side: Epoch Observation Details */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 bg-[#080D26] border border-[rgba(255,255,255,0.10)] px-2 py-0.5 rounded text-[11px]">
            <span className="text-[#8392C4]">EPOCH:</span>
            <span className="text-[#F4F7FF] font-semibold">
              {activeFrame?.date || '—'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#080D26] border border-[rgba(255,255,255,0.10)] px-2 py-0.5 rounded text-[11px]">
            <span className="text-[#8392C4]">BAND:</span>
            <span className="text-[#FFC857] font-semibold">
              {activeFrame?.wavelengthUm ? `${activeFrame.wavelengthUm} µm (IR)` : '—'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#080D26] border border-[rgba(255,255,255,0.10)] px-2 py-0.5 rounded text-[11px]">
            <span className="text-[#8392C4]">STATUS:</span>
            <span
              className={`font-bold ${
                isBlinking
                  ? 'text-[#FF7A59] animate-pulse'
                  : isPlaying
                  ? 'text-[#FFC857] animate-pulse'
                  : 'text-[#3DDC97]'
              }`}
            >
              {isBlinking
                ? `BLINK (${activeBlinkSlot})`
                : isPlaying
                ? 'PLAYING SEQUENCE'
                : 'SINGLE FRAME'}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN OBSERVATORY SKY VIEWPORT & OPTICAL EYEPIECE
         ========================================================================= */}
      <div className="relative w-full flex-1 min-h-0 bg-[#080D26] border border-[rgba(255,255,255,0.10)] rounded-lg overflow-hidden shadow-2xl flex items-center justify-center select-none">
        {/* Deep Space Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Astronomical Grid Coordinate Labels */}
        <div className="absolute inset-0 pointer-events-none z-10 text-[10px] font-mono text-[#8392C4]/50 select-none p-4">
          <span className="absolute top-4 left-6">RA 12h 00m / +45°</span>
          <span className="absolute top-4 right-20">RA 16h 00m / +45°</span>
          <span className="absolute top-1/2 left-6 -translate-y-1/2">
            RA 12h 00m / 00° Equator
          </span>
          <span className="absolute top-1/2 right-20 -translate-y-1/2">
            RA 16h 00m / 00°
          </span>
          <span className="absolute bottom-16 left-6">RA 12h 00m / -45°</span>
          <span className="absolute bottom-16 right-20">RA 16h 00m / -45°</span>

          {/* Background simulated star field */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#F4F7FF]/70 absolute top-20 left-1/4 shadow-[0_0_6px_#FFF]" />
          <div className="w-1 h-1 rounded-full bg-[#F4F7FF]/50 absolute top-1/3 left-1/6" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#3D7BFF]/70 absolute bottom-1/3 left-1/3 shadow-[0_0_8px_#3D7BFF]" />
          <div className="w-2 h-2 rounded-full bg-[#F4F7FF]/80 absolute top-24 right-1/4 shadow-[0_0_8px_#FFF]" />
        </div>

        {/* Top Floating Helper Banner */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-[#0E163B]/90 border border-[rgba(255,255,255,0.10)] px-3.5 py-1 rounded-full shadow-lg text-[10px] font-mono text-[#B6C2E8] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D7BFF] animate-ping" />
            <span>Tap sky to inspect • Drag to Pan • Scroll to Zoom</span>
          </div>
        </div>

        {/* Floating Top-Right Zoom & View Controls Toolbar */}
        <div className="absolute top-4 right-4 z-30 flex flex-col items-center bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-lg p-1 shadow-[0_24px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] gap-1">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-2 rounded text-[#B6C2E8] hover:text-[#3D7BFF] hover:bg-[#0E163B] transition-all duration-state active:scale-95"
            title="Zoom In (تكبير)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-2 rounded text-[#B6C2E8] hover:text-[#3D7BFF] hover:bg-[#0E163B] transition-all duration-state active:scale-95"
            title="Zoom Out (تصغير)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Recenter / Reset Zoom */}
          <button
            onClick={handleRecenter}
            className="p-2 rounded text-[#B6C2E8] hover:text-[#3D7BFF] hover:bg-[#0E163B] transition-all duration-state active:scale-95"
            title="Recenter View (إعادة الضبط)"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          <div className="w-5 h-px bg-[rgba(255,255,255,0.10)] my-0.5" />

          {/* Toggle Aperture Lens vs Full Wide Canvas */}
          <button
            onClick={() => setIsApertureMode(!isApertureMode)}
            className="p-2 rounded text-[#B6C2E8] hover:text-[#3D7BFF] hover:bg-[#0E163B] transition-all duration-state active:scale-95"
            title={isApertureMode ? 'Switch to Full Screen View' : 'Switch to Telescope Lens View'}
          >
            {isApertureMode ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          {/* Share Button Inside Telescope View */}
          <button
            onClick={onOpenShareModal}
            className="p-2 rounded text-[#B6C2E8] hover:text-[#3D7BFF] hover:bg-[#0E163B] transition-all duration-state active:scale-95"
            title="Share Observation (مشاركة اللقطة)"
          >
            <Share2 className="w-4 h-4 text-[#3D7BFF]" />
          </button>
        </div>

        {/* Active Zoom Indicator Badge */}
        {zoom > 1 && (
          <div className="absolute top-4 left-4 z-30 bg-[#162256] border border-[#3D7BFF]/50 px-2.5 py-1 rounded text-[10px] font-mono text-[#3D7BFF] font-semibold shadow-lg flex items-center gap-1.5">
            <span>ZOOM: {zoom}x</span>
            <button
              onClick={handleRecenter}
              className="hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Center Target Frame Viewport */}
        {isApertureMode ? (
          /* =====================================================================
             PRECISION OPTICAL EYEPIECE (Titanium Bezel + Laser Etched Reticle)
             ===================================================================== */
          <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] aspect-square flex items-center justify-center z-10 transition-all">
            {/* Top Lens Header Badge */}
            <div className="absolute -top-3.5 z-30 bg-[#0E163B] border border-[#3D7BFF] px-3.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#3D7BFF] tracking-widest uppercase shadow-[0_0_16px_rgba(61,123,255,0.4)]">
              {target?.name || 'TARGET'} LENS
            </div>

            {/* Outer Anodized Titanium Brushed Bezel Ring */}
            <div className="relative w-full h-full rounded-full p-2.5 sm:p-3 bg-gradient-to-tr from-[#0E163B] via-[#162256] to-[#0E163B] shadow-[0_24px_48px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.12)] flex items-center justify-center">
              
              {/* Inner Concentric Ring with Etched Optical Scales */}
              <div className="relative w-full h-full rounded-full border border-[#3D7BFF]/40 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.95)] bg-black">
                
                {/* Laser-etched Degree & Milliradian Reticle Ticks */}
                <div className="absolute inset-0 pointer-events-none z-30 select-none text-[9px] font-mono font-medium text-[#8392C4]/60">
                  <span className="absolute top-2 left-1/2 -translate-x-1/2">N (000°)</span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">E (090°)</span>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2">S (180°)</span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">W (270°)</span>
                  
                  {/* Subtle Central Reticle Crosshairs */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-[#3D7BFF]/20" />
                    <div className="h-full w-px bg-[#3D7BFF]/20 absolute" />
                    <div className="w-28 h-28 rounded-full border border-dashed border-[#3D7BFF]/25" />
                  </div>
                </div>

                {/* Telescope Circular Masked Viewport */}
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <FrameViewer
                    frames={target?.frames || []}
                    currentIndex={currentIndex}
                    isBlinking={isBlinking}
                    blinkFrameA={blinkFrameA}
                    blinkFrameB={blinkFrameB}
                    activeBlinkSlot={activeBlinkSlot}
                    showTrail={showTrail}
                    showReticle={showReticle}
                    colorMap={colorMap}
                    targetName={target?.name}
                    zoom={zoom}
                    pan={pan}
                    onPanChange={setPan}
                    onZoomChange={setZoom}
                  />
                </div>

                {/* Anti-Reflective Simulated Glass Optical Sheen */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-25 z-20" />
              </div>
            </div>
          </div>
        ) : (
          /* Full-Width Panoramic Deep Space View */
          <div className="w-full h-full absolute inset-0 z-10">
            <FrameViewer
              frames={target?.frames || []}
              currentIndex={currentIndex}
              isBlinking={isBlinking}
              blinkFrameA={blinkFrameA}
              blinkFrameB={blinkFrameB}
              activeBlinkSlot={activeBlinkSlot}
              showTrail={showTrail}
              showReticle={showReticle}
              colorMap={colorMap}
              targetName={target?.name}
              zoom={zoom}
              pan={pan}
              onPanChange={setPan}
              onZoomChange={setZoom}
            />
          </div>
        )}

        {/* =========================================================================
            BOTTOM FLOATING CONTROL BAR (Only the bottom controls exist now!)
           ========================================================================= */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 z-30 flex flex-wrap items-center gap-2">
          <div className="bg-[#162256]/95 border border-[rgba(255,255,255,0.10)] rounded-lg p-2.5 sm:px-3.5 sm:py-2 shadow-[0_24px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            {/* Celestial Coordinates */}
            <div className="hidden sm:block">
              <div className="text-[9px] text-[#8392C4] font-medium uppercase tracking-wider">
                COORDINATES
              </div>
              <div className="text-[#F4F7FF] font-semibold text-xs">
                RA {typeof target?.ra === 'number' ? target.ra.toFixed(2) : target?.ra}, Dec {typeof target?.dec === 'number' ? (target.dec >= 0 ? `+${target.dec.toFixed(2)}` : target.dec.toFixed(2)) : target?.dec}
              </div>
            </div>

            <div className="h-6 w-px bg-[rgba(255,255,255,0.10)] hidden sm:block" />

            {/* Playback Control: Direct Pause or Play/Settings */}
            <div className="flex items-center gap-1">
              {isPlaying ? (
                <button
                  onClick={() => setIsPlaying && setIsPlaying(false)}
                  className="px-3 py-1.5 rounded-md bg-[#FFC857] hover:bg-[#ffe082] text-[#080D26] font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  title="Pause Playback (إيقاف التشغيل)"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE (إيقاف)</span>
                </button>
              ) : (
                <button
                  onClick={onOpenPlaybackModal}
                  className="px-3 py-1.5 rounded-md bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white font-semibold flex items-center gap-1.5 shadow-cosmic-glow active:scale-95 transition-all"
                  title="Open Playback & Timeline Settings"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY / SETTINGS</span>
                </button>
              )}

              {/* Small settings icon for playback */}
              <button
                onClick={onOpenPlaybackModal}
                className="p-1.5 rounded bg-[#080D26] border border-[rgba(255,255,255,0.10)] text-[#B6C2E8] hover:text-[#3D7BFF] hover:border-[#3D7BFF]/50 transition-colors"
                title="Playback Options"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Blink Control: Direct Stop or Start/Settings */}
            <div className="flex items-center gap-1">
              {isBlinking ? (
                <button
                  onClick={() => setIsBlinking && setIsBlinking(false)}
                  className="px-3 py-1.5 rounded-md bg-[#FF7A59]/20 border border-[#FF7A59] text-[#FF7A59] font-bold flex items-center gap-1.5 shadow-coral-glow hover:bg-[#FF7A59]/30 active:scale-95 transition-all"
                  title="Stop Blink Mode (إيقاف الوميض)"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>STOP BLINK (إيقاف)</span>
                </button>
              ) : (
                <button
                  onClick={onOpenBlinkModal}
                  className="px-3 py-1.5 rounded-md bg-[#FF7A59] hover:bg-[#FF8F73] text-white font-semibold flex items-center gap-1.5 shadow-coral-glow active:scale-95 transition-all"
                  title="Open Blink Comparator"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>BLINK TOOL</span>
                </button>
              )}

              {/* Small settings icon for blink */}
              <button
                onClick={onOpenBlinkModal}
                className="p-1.5 rounded bg-[#080D26] border border-[rgba(255,255,255,0.10)] text-[#B6C2E8] hover:text-[#FF7A59] hover:border-[#FF7A59]/50 transition-colors"
                title="Blink Frequency & Options"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Share Observation Button */}
            <button
              onClick={onOpenShareModal}
              className="px-2.5 py-1.5 rounded-md bg-[#080D26] border border-[rgba(255,255,255,0.10)] text-[#B6C2E8] hover:text-[#3D7BFF] hover:border-[#3D7BFF]/50 font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              title="Share Observation"
            >
              <Share2 className="w-3.5 h-3.5 text-[#3D7BFF]" />
              <span className="hidden sm:inline">SHARE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
