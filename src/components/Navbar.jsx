import React from 'react';
import { Sparkles, Info, Wifi, WifiOff, Telescope, BookOpen, Compass } from 'lucide-react';

export default function Navbar({
  activeTab = 'telescope',
  setActiveTab,
  isOnline,
  backendInfo,
  onOpenInfo,
}) {
  const targetsCount = backendInfo?.targetsLoaded;

  return (
    <header className="w-full border-b border-[rgba(255,255,255,0.10)] bg-[#0E163B]/95 backdrop-blur-md sticky top-0 z-50 font-sans h-14 flex-shrink-0">
      <div className="max-w-[1650px] mx-auto px-3 sm:px-5 h-full flex items-center justify-between gap-2">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#3D7BFF]/10 border border-[#3D7BFF]/40 flex items-center justify-center text-[#3D7BFF] shadow-[0_0_12px_rgba(61,123,255,0.35)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-bold text-sm sm:text-base tracking-tight text-[#F4F7FF] flex items-center gap-1">
                SKY<span className="text-[#3D7BFF]">BLINK</span>
              </h1>
              <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-[#3D7BFF]/10 text-[#3D7BFF] border border-[#3D7BFF]/30 font-semibold hidden sm:inline">
                SPHEREx
              </span>
            </div>
            <p className="text-[10px] text-[#8392C4] font-sans hidden lg:block leading-none">
              Stars stay still. Moving objects shift.
            </p>
          </div>
        </div>

        {/* Center: Main Page Section Switcher (المرصد / القصة / خريطة السماء) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#080D26] border border-[rgba(255,255,255,0.10)] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('telescope')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition-all duration-state ${
              activeTab === 'telescope'
                ? 'bg-[#3D7BFF] text-white shadow-cosmic-glow'
                : 'text-[#B6C2E8] hover:text-white hover:bg-[#162256]/50'
            }`}
          >
            <Telescope className="w-3.5 h-3.5" />
            <span>TELESCOPE (المرصد)</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition-all duration-state ${
              activeTab === 'story'
                ? 'bg-[#3D7BFF] text-white shadow-cosmic-glow'
                : 'text-[#B6C2E8] hover:text-white hover:bg-[#162256]/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>GUIDED STORY (القصة)</span>
          </button>

          <button
            onClick={() => setActiveTab('skymap')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition-all duration-state ${
              activeTab === 'skymap'
                ? 'bg-[#3D7BFF] text-white shadow-cosmic-glow'
                : 'text-[#B6C2E8] hover:text-white hover:bg-[#162256]/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>SKY MAP (خريطة السماء)</span>
          </button>
        </nav>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Connection status */}
          <div
            className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-1 rounded-full border transition-all duration-state ${
              isOnline
                ? 'bg-[#080D26] border-[#3DDC97]/40 text-[#F4F7FF]'
                : 'bg-[#080D26] border-[rgba(255,255,255,0.10)] text-[#8392C4]'
            }`}
            title={
              isOnline
                ? `Connected to SkyBlink Express API with live NASA JPL & CDS resolvers.`
                : 'Backend API offline. Using bundled high-fidelity fallback telemetry.'
            }
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-[#3DDC97] animate-pulse" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-[#FFC857]" />
            )}
            <span className="hidden md:inline font-medium">
              {isOnline
                ? `NASA JPL LIVE ${targetsCount ? `(${targetsCount})` : ''}`
                : 'STANDALONE'}
            </span>
          </div>

          {/* Quick Info Button */}
          <button
            onClick={onOpenInfo}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[#080D26] text-[#B6C2E8] hover:text-[#3D7BFF] hover:border-[#3D7BFF]/50 transition-all duration-state"
            title="Scientific Context & Mission Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
