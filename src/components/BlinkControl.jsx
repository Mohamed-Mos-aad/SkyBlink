import React from 'react';
import { Eye, EyeOff, Zap, Sliders } from 'lucide-react';

export default function BlinkControl({
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
  const speeds = [
    { label: 'FAST (200ms)', value: 200 },
    { label: 'NORMAL (400ms)', value: 400 },
    { label: 'SLOW (800ms)', value: 800 },
  ];

  return (
    <div className="bg-space-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-lg flex flex-col gap-3">
      {/* Header and Toggle Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyanAccent" />
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            Blink Comparator (وميض المقارنة)
          </h3>
        </div>

        <button
          onClick={() => setIsBlinking(!isBlinking)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
            isBlinking
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-red-500/20'
              : 'bg-cyanAccent text-black hover:bg-cyan-300 shadow-cyanAccent/20'
          }`}
        >
          {isBlinking ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>STOP BLINK</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>START BLINK</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Selectors (A vs B) */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {/* Frame A */}
        <div
          className={`p-2 rounded-lg border transition-all ${
            isBlinking && activeBlinkSlot === 'A'
              ? 'border-cyanAccent bg-cyanAccent/10 text-cyanAccent'
              : 'border-slate-800 bg-space-950/60 text-slate-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">FRAME A</span>
            {isBlinking && activeBlinkSlot === 'A' && (
              <span className="w-2 h-2 rounded-full bg-cyanAccent animate-ping" />
            )}
          </div>
          <select
            value={blinkFrameA}
            disabled={isBlinking}
            onChange={(e) => setBlinkFrameA(Number(e.target.value))}
            className="w-full bg-space-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 outline-none focus:border-cyanAccent text-xs cursor-pointer"
          >
            {frames.map((f, i) => (
              <option key={f.id} value={i}>
                #{i + 1} ({f.date})
              </option>
            ))}
          </select>
        </div>

        {/* Frame B */}
        <div
          className={`p-2 rounded-lg border transition-all ${
            isBlinking && activeBlinkSlot === 'B'
              ? 'border-cyanAccent bg-cyanAccent/10 text-cyanAccent'
              : 'border-slate-800 bg-space-950/60 text-slate-300'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">FRAME B</span>
            {isBlinking && activeBlinkSlot === 'B' && (
              <span className="w-2 h-2 rounded-full bg-cyanAccent animate-ping" />
            )}
          </div>
          <select
            value={blinkFrameB}
            disabled={isBlinking}
            onChange={(e) => setBlinkFrameB(Number(e.target.value))}
            className="w-full bg-space-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 outline-none focus:border-cyanAccent text-xs cursor-pointer"
          >
            {frames.map((f, i) => (
              <option key={f.id} value={i}>
                #{i + 1} ({f.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Speed Selector Buttons */}
      <div className="flex items-center gap-1.5 text-xs font-mono">
        <span className="text-slate-400 text-[11px] mr-1">SPEED:</span>
        {speeds.map((s) => (
          <button
            key={s.value}
            onClick={() => setBlinkSpeedMs(s.value)}
            className={`flex-1 py-1 rounded border text-[10px] font-bold transition-all ${
              blinkSpeedMs === s.value
                ? 'bg-slate-700 text-cyanAccent border-cyanAccent/50'
                : 'bg-space-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
