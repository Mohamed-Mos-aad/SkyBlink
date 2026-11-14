import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';

export default function ShareModal({
  target,
  currentIndex,
  isBlinking,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}?target=${target?.id}&epoch=${currentIndex}&blink=${isBlinking}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFrame = target?.frames?.[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#080D26]/85 backdrop-blur-md flex items-center justify-center p-4 font-sans text-[#F4F7FF]">
      <div className="bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-xl max-w-md w-full p-6 shadow-[0_24px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] relative flex flex-col gap-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-1.5 absolute top-4 right-4 text-[#8392C4] hover:text-[#F4F7FF] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#3D7BFF]/10 text-[#3D7BFF] border border-[#3D7BFF]/30">
            <Share2 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-display font-bold text-[#F4F7FF] uppercase tracking-wide">
            Share Observation (مشاركة اللقطة)
          </h3>
        </div>

        {/* Preview image */}
        {currentFrame && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-[rgba(255,255,255,0.10)] bg-black flex items-center justify-center">
            <img
              src={currentFrame.url}
              alt={target.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-[#0E163B]/90 border border-[rgba(255,255,255,0.10)] px-2 py-1 rounded text-[10px] font-mono text-[#3D7BFF] backdrop-blur-md">
              {target.name} • {currentFrame.date} • {currentFrame.wavelengthUm} µm
            </div>
          </div>
        )}

        {/* Share Link input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-[#8392C4]">
            DIRECT OBSERVATORY URL:
          </label>
          <div className="flex items-center gap-2 bg-[#0E163B] border border-[rgba(255,255,255,0.10)] rounded-lg p-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-[#F4F7FF] font-mono flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white font-mono font-bold text-xs rounded-md flex items-center gap-1 shadow-cosmic-glow transition-all duration-state"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#8392C4] font-sans leading-relaxed">
          Anyone with this link will open SkyBlink focused on this exact celestial object and observation epoch.
        </p>
      </div>
    </div>
  );
}
