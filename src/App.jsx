import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TargetSidebar from './components/TargetSidebar';
import EyepieceFrame from './components/EyepieceFrame';
import PlaybackModal from './components/PlaybackModal';
import BlinkModal from './components/BlinkModal';
import StoryCards from './components/StoryCards';
import SkyPicker from './components/SkyPicker';
import ShareModal from './components/ShareModal';
import { FALLBACK_TARGETS } from './data/fallbackManifest';
import {
  checkBackendHealth,
  getFeaturedTargets,
  getTargetDetails,
  getFullCatalog,
} from './services/skyblinkApi';
import { ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [targets, setTargets] = useState(FALLBACK_TARGETS);
  const [selectedTargetId, setSelectedTargetId] = useState('3i-atlas');
  const [targetDetails, setTargetDetails] = useState(FALLBACK_TARGETS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active view tab: 'telescope' | 'story' | 'skymap'
  const [activeTab, setActiveTab] = useState('telescope');

  // Blink state
  const [isBlinking, setIsBlinking] = useState(false);
  const [blinkFrameA, setBlinkFrameA] = useState(0);
  const [blinkFrameB, setBlinkFrameB] = useState(1);
  const [blinkSpeedMs, setBlinkSpeedMs] = useState(400);
  const [activeBlinkSlot, setActiveBlinkSlot] = useState('A');

  // Playback & view options
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrail, setShowTrail] = useState(true);
  const [showReticle, setShowReticle] = useState(false);
  const [colorMap, setColorMap] = useState('grayscale');
  const [isOnline, setIsOnline] = useState(false);
  const [backendInfo, setBackendInfo] = useState(null);

  // Modals & Popups
  const [showPlaybackModal, setShowPlaybackModal] = useState(false);
  const [showBlinkModal, setShowBlinkModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Parse URL query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetParam = params.get('target');
    const epochParam = params.get('epoch');
    const blinkParam = params.get('blink');

    if (targetParam) {
      setSelectedTargetId(targetParam);
    }
    if (epochParam !== null && !isNaN(Number(epochParam))) {
      setCurrentIndex(Number(epochParam));
    }
    if (blinkParam === 'true') {
      setIsBlinking(true);
    }
  }, []);

  // Health check & Initial targets load from Express backend
  useEffect(() => {
    async function initBackendConnection() {
      const health = await checkBackendHealth();
      if (health && health.status === 'ok') {
        setIsOnline(true);
        setBackendInfo(health);

        // Fetch targets list from backend
        const backendTargets = await getFeaturedTargets();
        if (Array.isArray(backendTargets) && backendTargets.length > 0) {
          setTargets(backendTargets);
        }

        // Also fetch catalog to expand available targets in the background
        const catalog = await getFullCatalog();
        if (Array.isArray(catalog) && catalog.length > backendTargets.length) {
          setTargets((prev) => {
            const ids = new Set(prev.map((t) => t.id));
            const newItems = catalog.filter((c) => !ids.has(c.id));
            return [...prev, ...newItems];
          });
        }
      } else {
        setIsOnline(false);
        setBackendInfo(null);
        setTargets(FALLBACK_TARGETS);
      }
    }

    initBackendConnection();
  }, []);

  // Fetch target details when selectedTargetId changes (supports Dynamic Self-Resolution!)
  useEffect(() => {
    let isCancelled = false;

    async function loadTarget() {
      setIsBlinking(false);
      setIsPlaying(false);
      setCurrentIndex(0);

      const details = await getTargetDetails(selectedTargetId);
      if (isCancelled || !details) return;

      setTargetDetails(details);
      setBlinkFrameA(0);
      const framesCount = details.frames?.length || 1;
      setBlinkFrameB(Math.max(1, framesCount - 1));

      // If dynamically resolved target wasn't in targets list, add it seamlessly
      setTargets((prev) => {
        if (prev.some((t) => t.id === details.id)) return prev;
        return [details, ...prev];
      });
    }

    loadTarget();

    return () => {
      isCancelled = true;
    };
  }, [selectedTargetId]);

  // Autoplay Sequence Interval
  useEffect(() => {
    if (!isPlaying || isBlinking || !targetDetails?.frames?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % targetDetails.frames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, isBlinking, targetDetails?.frames?.length]);

  // Blink Interval Timer
  useEffect(() => {
    if (!isBlinking) return;
    const interval = setInterval(() => {
      setActiveBlinkSlot((prev) => (prev === 'A' ? 'B' : 'A'));
    }, blinkSpeedMs);
    return () => clearInterval(interval);
  }, [isBlinking, blinkSpeedMs]);

  // Handle selection from sidebar
  const handleSelectTarget = (id, targetItem) => {
    setSelectedTargetId(id);
    if (targetItem && targetItem.frames && targetItem.frames.length > 0) {
      setTargetDetails(targetItem);
      setBlinkFrameA(0);
      setBlinkFrameB(Math.max(1, targetItem.frames.length - 1));
    }
  };

  // Handle guided story action hooks: keeps user IN STORY unless explicitly navigating to telescope
  const handleStoryStepAction = (frameIdx, enableBlink, navigateToTelescope = false) => {
    if (frameIdx !== undefined && frameIdx !== null) {
      setCurrentIndex(frameIdx);
    }
    if (enableBlink !== undefined) {
      setIsBlinking(enableBlink);
    }
    if (navigateToTelescope) {
      setActiveTab('telescope');
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#080D26] text-[#F4F7FF] flex flex-col font-sans selection:bg-[#3D7BFF] selection:text-white">
      {/* Main Top Navigation Header with Integrated Page Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        backendInfo={backendInfo}
        onOpenInfo={() => setShowInfoModal(true)}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 min-h-0 w-full max-w-[1650px] mx-auto p-2 sm:p-3 flex flex-col overflow-hidden">
        {/* PAGE 1: TELESCOPE OBSERVATORY */}
        {activeTab === 'telescope' && (
          <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 items-stretch overflow-hidden">
            {/* Left: Find a Target Sidebar with Internal Scroll */}
            <TargetSidebar
              targets={targets}
              selectedTargetId={selectedTargetId}
              onSelectTarget={handleSelectTarget}
              isOnline={isOnline}
            />

            {/* Right: Full-Width Observatory Viewport */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
              <EyepieceFrame
                target={targetDetails}
                currentIndex={currentIndex}
                isBlinking={isBlinking}
                setIsBlinking={setIsBlinking}
                blinkFrameA={blinkFrameA}
                blinkFrameB={blinkFrameB}
                activeBlinkSlot={activeBlinkSlot}
                showTrail={showTrail}
                showReticle={showReticle}
                colorMap={colorMap}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                onOpenPlaybackModal={() => setShowPlaybackModal(true)}
                onOpenBlinkModal={() => setShowBlinkModal(true)}
                onOpenShareModal={() => setShowShareModal(true)}
              />
            </div>
          </div>
        )}

        {/* PAGE 2: GUIDED CELESTIAL STORY */}
        {activeTab === 'story' && (
          <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3 w-full custom-scrollbar">
            <StoryCards
              targetId={selectedTargetId}
              onStepAction={handleStoryStepAction}
              onClose={() => setActiveTab('telescope')}
            />
          </div>
        )}

        {/* PAGE 3: FULL CELESTIAL SKY MAP */}
        {activeTab === 'skymap' && (
          <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3 w-full custom-scrollbar max-w-5xl mx-auto">
            <SkyPicker
              targets={targets}
              selectedTargetId={selectedTargetId}
              onSelectTarget={(id) => {
                setSelectedTargetId(id);
                setActiveTab('telescope');
              }}
              onClose={() => setActiveTab('telescope')}
            />
          </div>
        )}
      </main>

      {/* Compact Scientific Footer */}
      <footer className="w-full flex-shrink-0 border-t border-[rgba(255,255,255,0.10)] bg-[#080D26] px-4 py-2 text-center text-[11px] font-mono text-[#8392C4]">
        <div className="max-w-[1650px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-left">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97] flex-shrink-0" />
            <span>Built for NASA Space Apps 2026, Cairo. Data: NASA/IPAC IRSA (SPHEREx).</span>
          </div>
          <div className="text-[#B6C2E8] font-sans hidden sm:block">
            "Stars stay still. Moving objects shift between images."
          </div>
        </div>
      </footer>

      {/* Playback & Timeline Controls Modal */}
      <PlaybackModal
        isOpen={showPlaybackModal}
        onClose={() => setShowPlaybackModal(false)}
        frames={targetDetails?.frames || []}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        showTrail={showTrail}
        setShowTrail={setShowTrail}
        showReticle={showReticle}
        setShowReticle={setShowReticle}
        colorMap={colorMap}
        setColorMap={setColorMap}
        isBlinking={isBlinking}
      />

      {/* Blink Comparator Tool Modal */}
      <BlinkModal
        isOpen={showBlinkModal}
        onClose={() => setShowBlinkModal(false)}
        frames={targetDetails?.frames || []}
        isBlinking={isBlinking}
        setIsBlinking={(val) => {
          if (val) setIsPlaying(false);
          setIsBlinking(val);
        }}
        blinkFrameA={blinkFrameA}
        setBlinkFrameA={setBlinkFrameA}
        blinkFrameB={blinkFrameB}
        setBlinkFrameB={setBlinkFrameB}
        blinkSpeedMs={blinkSpeedMs}
        setBlinkSpeedMs={setBlinkSpeedMs}
        activeBlinkSlot={activeBlinkSlot}
      />

      {/* Share / Export Modal */}
      {showShareModal && (
        <ShareModal
          target={targetDetails}
          currentIndex={currentIndex}
          isBlinking={isBlinking}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Info / Mission Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-[#080D26]/85 backdrop-blur-md flex items-center justify-center p-4 font-sans text-[#F4F7FF] animate-in fade-in duration-150">
          <div className="bg-[#162256] border border-[rgba(255,255,255,0.10)] rounded-xl max-w-lg w-full p-6 shadow-[0_24px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] relative">
            <h3 className="text-lg font-display font-bold text-[#3D7BFF] mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              <span>SkyBlink — Mission & Scientific Principles</span>
            </h3>
            <div className="text-xs text-[#B6C2E8] space-y-3 leading-relaxed">
              <p>
                <strong className="text-[#F4F7FF]">What is SPHEREx?</strong> NASA's Spectro-Photometer for the History of the Universe,
                Epoch of Reionization and Ices Explorer surveys the all-sky every 6 months across 102 near-infrared bands (0.75 – 5.0 µm).
              </p>
              <p>
                <strong className="text-[#F4F7FF]">How Does Blink Work?</strong> Distant stars are effectively stationary on human timescales.
                Solar system bodies (comets, asteroids) or high-proper-motion objects move relative to the background stars.
                By aligning multiple observation epochs to identical celestial coordinates (WCS Reprojection), stars stay locked in place,
                causing moving objects to visually "jump" back and forth.
              </p>
              <p>
                <strong className="text-[#F4F7FF]">Live NASA JPL Integration:</strong> The observatory connects live to NASA JPL Small-Body Database and CDS Sesame resolvers for instant celestial motion tracking.
              </p>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full py-2.5 bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white font-mono font-bold rounded-lg text-xs shadow-cosmic-glow transition-all duration-state"
            >
              CLOSE & RESUME OBSERVATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
