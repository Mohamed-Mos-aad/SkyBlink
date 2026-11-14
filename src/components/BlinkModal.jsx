import React from 'react';
import {
  X,
  Zap,
  Eye,
  EyeOff,
  Gauge,
  Info,
} from 'lucide-react';

export default function BlinkModal({
  isOpen,
  onClose,
  frames = [],
  isBlinking,
  setIsBlinking,
  blinkFrameA,
  setBlinkFrameA,
  blinkFrameB,
  setBlinkFrameB,
  blinkSpeedMs,
  setBlinkSpeedMs,
  activeBlinkSlot,
}) {
  if (!isOpen) return null;

  const speeds = [
    { label: 'FAST (200ms)', value: 200 },
    { label: 'NORMAL (400ms)', value: 400 },
    { label: 'SLOW (800ms)', value: 800 },
  ];

  const handleToggleBlinkAndClose = () => {
    if (isBlinking) {
      setIsBlinking(false);
    } else {
      setIsBlinking(true);
      onClose(); // Automatically close modal so user watches the blink comparator in action!
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080D26]/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-[0_24px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] relative flex flex-col gap-5 text-[#F4F7FF]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FF7A59]/10 border border-[#FF7A59]/40 text-[#FF7A59]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-[#F4F7FF] tracking-tight">
                Blink Comparator Tool
              </h3>
              <p className="text-xs text-[#8392C4] font-sans">
                Stars stay still. Moving objects shift between images.
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

        {/* Master Blink Action Toggle (Comet Coral #FF7A59) */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#0E163B] border border-[rgba(255,255,255,0.10)]">
          <div>
            <div className="text-xs font-mono font-bold text-[#B6C2E8] flex items-center gap-2">
              <span>COMPARATOR STATUS:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isBlinking ? 'bg-[#FF7A59]/20 text-[#FF7A59]' : 'bg-[#080D26] text-[#8392C4]'}`}>
                {isBlinking ? `ACTIVE (SLOT ${activeBlinkSlot})` : 'PAUSED'}
              </span>
            </div>
            <p className="text-[11px] text-[#8392C4] font-sans mt-0.5">
              Alternates 2 infrared passes to isolate kinetic motion against stationary stars.
            </p>
          </div>

          <button
            onClick={handleToggleBlinkAndClose}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all duration-pulse active:scale-95 ${
              isBlinking
                ? 'bg-[#FF7A59]/20 text-[#FF7A59] border border-[#FF7A59]/50 hover:bg-[#FF7A59]/30'
                : 'bg-[#FF7A59] hover:bg-[#FF8F73] text-white shadow-[0_0_20px_rgba(255,122,89,0.45)]'
            }`}
          >
            {isBlinking ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>STOP BLINK</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>START & CLOSE (بدء الوميض)</span>
              </>
            )}
          </button>
        </div>

        {/* Frame A vs Frame B Selectors */}
        <div className="grid grid-cols-2 gap-3">
          {/* Frame A Slot */}
          <div
            className={`p-3 rounded-lg border transition-all duration-state ${
              isBlinking && activeBlinkSlot === 'A'
                ? 'border-[#3D7BFF] bg-[#0E163B] text-[#3D7BFF] shadow-[0_0_16px_rgba(61,123,255,0.25)]'
                : 'border-[rgba(255,255,255,0.10)] bg-[#080D26] text-[#B6C2E8]'
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-mono font-semibold">FRAME A (REFERENCE)</span>
              {isBlinking && activeBlinkSlot === 'A' && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#3D7BFF] animate-ping" />
              )}
            </div>
            <select
              value={blinkFrameA}
              disabled={isBlinking}
              onChange={(e) => setBlinkFrameA(Number(e.target.value))}
              className="w-full bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-md px-2 py-1.5 text-[#F4F7FF] outline-none focus:border-[#3D7BFF] text-xs font-mono cursor-pointer disabled:opacity-50"
            >
              {frames.map((f, i) => (
                <option key={f.id || i} value={i}>
                  Pass #{i + 1} ({f.date})
                </option>
              ))}
            </select>
          </div>

          {/* Frame B Slot */}
          <div
            className={`p-3 rounded-lg border transition-all duration-state ${
              isBlinking && activeBlinkSlot === 'B'
                ? 'border-[#FF7A59] bg-[#0E163B] text-[#FF7A59] shadow-[0_0_16px_rgba(255,122,89,0.25)]'
                : 'border-[rgba(255,255,255,0.10)] bg-[#080D26] text-[#B6C2E8]'
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-mono font-semibold">FRAME B (TARGET)</span>
              {isBlinking && activeBlinkSlot === 'B' && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A59] animate-ping" />
              )}
            </div>
            <select
              value={blinkFrameB}
              disabled={isBlinking}
              onChange={(e) => setBlinkFrameB(Number(e.target.value))}
              className="w-full bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-md px-2 py-1.5 text-[#F4F7FF] outline-none focus:border-[#FF7A59] text-xs font-mono cursor-pointer disabled:opacity-50"
            >
              {frames.map((f, i) => (
                <option key={f.id || i} value={i}>
                  Pass #{i + 1} ({f.date})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#8392C4]">
            <Gauge className="w-3.5 h-3.5 text-[#3D7BFF]" />
            <span>BLINK FREQUENCY (تردد الوميض):</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {speeds.map((s) => (
              <button
                key={s.value}
                onClick={() => setBlinkSpeedMs(s.value)}
                className={`py-2 px-3 rounded-md text-xs font-mono font-semibold transition-all duration-state ${
                  blinkSpeedMs === s.value
                    ? 'bg-[#3D7BFF] text-white shadow-md shadow-[#3D7BFF]/30'
                    : 'bg-[#0E163B] border border-[rgba(255,255,255,0.10)] text-[#B6C2E8] hover:border-[#3D7BFF]/50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scientific Context Tip */}
        <div className="p-3 rounded-lg bg-[#0E163B]/80 border border-[rgba(255,255,255,0.10)] text-[11px] text-[#8392C4] font-sans flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-[#3D7BFF] flex-shrink-0 mt-0.5" />
          <span>
            Blink comparison is the exact optical technique Clyde Tombaugh used to discover Pluto in 1930. By toggling two epochs rapidly, your visual cortex instantly detects any object that shifted position!
          </span>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0E163B] hover:bg-[#080D26] border border-[rgba(255,255,255,0.10)] text-xs font-mono font-semibold text-[#F4F7FF] rounded-lg transition-colors"
          >
            Close (إغلاق)
          </button>
        </div>
      </div>
    </div>
  );
}
