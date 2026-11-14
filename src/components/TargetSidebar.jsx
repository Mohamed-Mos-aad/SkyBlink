import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Compass, Loader2, Sparkles, Orbit } from 'lucide-react';
import { searchTargetSuggestions } from '../services/skyblinkApi';

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'comet', label: 'COMETS' },
  { id: 'asteroid', label: 'ASTEROIDS' },
  { id: 'star', label: 'STARS / DWARFS' },
];

export default function TargetSidebar({
  targets = [],
  selectedTargetId,
  onSelectTarget,
  isOnline = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  // Debounced live search using the new /api/search/suggest endpoint
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchTargetSuggestions(
          searchTerm,
          selectedCategory,
          40
        );
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 180); // 180ms responsive debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, selectedCategory]);

  // When not actively searching, filter initial targets by selected category
  const displayedTargets = searchTerm.trim()
    ? searchResults
    : targets.filter((t) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'comet') {
          return (
            t.category === 'comet' ||
            t.id.includes('atlas') ||
            t.name.toLowerCase().includes('comet')
          );
        }
        if (selectedCategory === 'asteroid') {
          return (
            t.category === 'asteroid' ||
            t.name.toLowerCase().includes('asteroid') ||
            t.id.includes('chiron') ||
            t.id.includes('nx1') ||
            t.id.includes('yr4')
          );
        }
        if (selectedCategory === 'star') {
          return (
            t.category === 'star' ||
            t.category === 'dwarf' ||
            t.name.toLowerCase().includes('dwarf') ||
            t.id.includes('wise')
          );
        }
        return true;
      });

  return (
    <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-[#0E163B] border-r border-[rgba(255,255,255,0.10)] flex flex-col h-full overflow-hidden font-sans">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-[rgba(255,255,255,0.10)] flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-[#F4F7FF] tracking-tight">
              Find a Target
            </h2>
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#3DDC97]/10 text-[#3DDC97] border border-[#3DDC97]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC97] animate-pulse" />
                  NASA JPL LIVE
                </span>
              ) : (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#3D7BFF]/10 text-[#3D7BFF] border border-[#3D7BFF]/30">
                  SPHEREx 2026
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-[#8392C4] mt-1 leading-relaxed">
            Live search across NASA JPL Small-Body & CDS astronomical catalogs.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[#3D7BFF] absolute left-3 animate-spin pointer-events-none" />
          ) : (
            <Search className="w-4 h-4 text-[#8392C4] absolute left-3 pointer-events-none" />
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search NASA JPL (e.g. Jabb, Apop, 3I)..."
            className="w-full bg-[#080D26] border border-[rgba(255,255,255,0.10)] rounded-lg pl-9 pr-9 py-2 text-xs text-[#F4F7FF] placeholder-[#8392C4] font-mono outline-none focus:border-[#3D7BFF] focus:ring-1 focus:ring-[#3D7BFF]/50 transition-all duration-state ease-state"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 text-[#8392C4] hover:text-[#F4F7FF] transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold whitespace-nowrap transition-all duration-state ${
                selectedCategory === cat.id
                  ? 'bg-[#3D7BFF] text-white shadow-cosmic-glow'
                  : 'bg-[#080D26] text-[#8392C4] border border-[rgba(255,255,255,0.10)] hover:border-[#3D7BFF]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Section divider with counter */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-[#8392C4] pt-0.5">
          <span className="uppercase font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D7BFF] animate-pulse" />
            {searchTerm.trim() ? 'SEARCH RESULTS' : 'FEATURED TARGETS'}
          </span>
          <span className="text-[#3D7BFF] font-medium">
            {displayedTargets.length} {displayedTargets.length === 1 ? 'OBJECT' : 'OBJECTS'}
          </span>
        </div>
      </div>

      {/* Scrollable Target Cards List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2.5">
        {isLoading && displayedTargets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#8392C4]">
            <Loader2 className="w-8 h-8 text-[#3D7BFF] animate-spin mb-2" />
            <p className="text-xs font-semibold text-[#F4F7FF]">Querying NASA JPL Small-Body Database...</p>
          </div>
        ) : displayedTargets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#8392C4]">
            <Compass className="w-8 h-8 text-[#8392C4]/40 mb-2" />
            <p className="text-xs font-semibold text-[#F4F7FF]">
              No celestial targets match "{searchTerm}"
            </p>
            <p className="text-[11px] text-[#8392C4] mt-1">
              Try searching by asteroid number, comet designation, or RA / Dec coordinates.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-3 px-3 py-1 bg-[#3D7BFF]/10 text-[#3D7BFF] border border-[#3D7BFF]/30 rounded-md text-xs font-mono hover:bg-[#3D7BFF]/20 transition-all duration-state"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedTargets.map((t) => {
            const isSelected = t.id === selectedTargetId;
            const frameCount = t.frameCount || t.frames?.length || 5;

            return (
              <div
                key={t.id}
                onClick={() => onSelectTarget(t.id, t)}
                className={`group relative p-3 rounded-lg border transition-all duration-state ease-state cursor-pointer flex items-center gap-3.5 select-none ${
                  isSelected
                    ? 'border-[#3D7BFF] bg-[#162256] shadow-[0_0_24px_rgba(61,123,255,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'border-[rgba(255,255,255,0.10)] bg-[#080D26]/70 hover:border-[#3D7BFF]/40 hover:bg-[#162256]/50'
                }`}
              >
                {/* Visual Celestial Kinetic Icon Badge */}
                <div className="relative w-11 h-11 rounded-full bg-[#080D26] border border-[rgba(255,255,255,0.10)] flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
                  <div className="absolute inset-1.5 rounded-full border border-[rgba(255,255,255,0.08)]" />
                  
                  {/* Moving Kinetic Celestial Body in Comet Coral #FF7A59 */}
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF7A59] shadow-[0_0_10px_#FF7A59] relative">
                    <span className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-[#F4F7FF] shadow-[0_0_4px_#FFF]" />
                  </div>
                </div>

                {/* Target Information */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Top Row: Name and Badges */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className={`text-sm font-display font-bold truncate ${isSelected ? 'text-[#3D7BFF]' : 'text-[#F4F7FF] group-hover:text-[#6A9BFF]'} transition-colors`}>
                      {t.name}
                    </h3>
                    
                    {t.isExternal ? (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/40 flex-shrink-0 whitespace-nowrap">
                        JPL LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#3DDC97]/10 text-[#3DDC97] border border-[#3DDC97]/30 flex-shrink-0 whitespace-nowrap">
                        {frameCount} frames
                      </span>
                    )}
                  </div>

                  {/* Secondary Designation (if present) */}
                  {t.designation && t.designation !== t.name && (
                    <div className="text-[10px] font-mono text-[#3D7BFF] truncate -mt-0.5 mb-1">
                      {t.designation}
                    </div>
                  )}

                  {/* Middle Row: Description */}
                  <p className="text-[11px] text-[#8392C4] font-sans line-clamp-1 leading-snug mb-1.5">
                    {t.blurb}
                  </p>

                  {/* Bottom Row: Celestial Direction & Coordinates in JetBrains Mono */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8392C4]">
                    <span>
                      RA <span className="text-[#B6C2E8] font-medium">{typeof t.ra === 'number' ? t.ra.toFixed(2) : t.ra}°</span>
                    </span>
                    <span>
                      Dec <span className="text-[#B6C2E8] font-medium">{typeof t.dec === 'number' ? (t.dec >= 0 ? `+${t.dec.toFixed(2)}` : t.dec.toFixed(2)) : t.dec}°</span>
                    </span>
                  </div>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="w-1 h-7 rounded-full bg-[#3D7BFF] shadow-[0_0_8px_#3D7BFF]" />
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
