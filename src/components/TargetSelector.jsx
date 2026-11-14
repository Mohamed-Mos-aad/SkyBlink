import React from 'react';
import { Target, Telescope, Calendar } from 'lucide-react';

export default function TargetSelector({
  targets = [],
  selectedTargetId,
  onSelectTarget,
}) {
  return (
    <div className="bg-space-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 backdrop-blur-md shadow-lg flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Telescope className="w-4 h-4 text-cyanAccent" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          Featured Celestial Targets (الأجرام المختارة)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {targets.map((t) => {
          const isSelected = t.id === selectedTargetId;
          const firstThumb = t.previewUrl || (t.frames && t.frames[0]?.thumb);

          return (
            <div
              key={t.id}
              onClick={() => onSelectTarget(t.id)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                isSelected
                  ? 'border-cyanAccent bg-cyanAccent/10 shadow-[0_0_15px_rgba(0,240,255,0.15)] ring-1 ring-cyanAccent/50'
                  : 'border-slate-800 bg-space-950/60 hover:border-slate-700 hover:bg-space-950'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-black border border-slate-800 overflow-hidden flex-shrink-0">
                {firstThumb ? (
                  <img
                    src={firstThumb}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Target className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Target Metadata */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-cyanAccent' : 'text-slate-200'}`}>
                    {t.name}
                  </h4>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  RA {t.ra}° / Dec {t.dec}°
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 font-mono">
                  <Calendar className="w-2.5 h-2.5 text-slate-400" />
                  <span>{t.frameCount || t.frames?.length || 0} Epochs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
