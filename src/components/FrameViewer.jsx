import React, { useEffect, useRef, useState } from 'react';
import TrailOverlay from './TrailOverlay';

export default function FrameViewer({
  frames = [],
  currentIndex = 0,
  isBlinking = false,
  blinkFrameA = 0,
  blinkFrameB = 1,
  activeBlinkSlot = 'A',
  showTrail = true,
  showReticle = false,
  colorMap = 'grayscale',
  targetName = '',
  zoom = 1,
  pan = { x: 0, y: 0 },
  onPanChange,
  onZoomChange,
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Preload adjacent frames
  useEffect(() => {
    if (!frames.length) return;
    const preloadIndices = [
      (currentIndex + 1) % frames.length,
      (currentIndex - 1 + frames.length) % frames.length,
      blinkFrameA,
      blinkFrameB,
    ];
    preloadIndices.forEach((idx) => {
      if (frames[idx]?.url) {
        const img = new Image();
        img.src = frames[idx].url;
      }
    });
  }, [currentIndex, frames, blinkFrameA, blinkFrameB]);

  // CSS filter maps for False-Color visualization
  const getColorFilter = () => {
    switch (colorMap) {
      case 'inferno':
        return 'contrast(1.25) saturate(2.2) sepia(0.85) hue-rotate(-20deg)';
      case 'cyan':
        return 'contrast(1.2) saturate(1.8) hue-rotate(160deg)';
      default:
        return 'none';
    }
  };

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    if (onPanChange) {
      onPanChange({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e) => {
    if (!onZoomChange) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      onZoomChange((z) => Math.min(4, +(z + 0.25).toFixed(2)));
    } else {
      onZoomChange((z) => Math.max(1, +(z - 0.25).toFixed(2)));
    }
  };

  const frameA = frames[blinkFrameA] || frames[0];
  const frameB = frames[blinkFrameB] || frames[frames.length - 1] || frames[0];
  const currentSingleFrame = frames[currentIndex] || frames[0];

  const activeDisplayIndex = isBlinking
    ? activeBlinkSlot === 'A'
      ? blinkFrameA
      : blinkFrameB
    : currentIndex;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full select-none bg-black overflow-hidden flex items-center justify-center ${
        zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      }`}
    >
      {/* Zoomable & Pannable Master Viewport */}
      <div
        className="w-full h-full relative transition-transform duration-75 will-change-transform flex items-center justify-center"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
      >
        {/* Visual Filter Container */}
        <div
          className="w-full h-full relative transition-all duration-300"
          style={{ filter: getColorFilter() }}
        >
          {isBlinking ? (
            <>
              <img
                src={frameA?.url}
                alt="Frame A"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
                  activeBlinkSlot === 'A' ? 'opacity-100' : 'opacity-0'
                }`}
                draggable="false"
              />
              <img
                src={frameB?.url}
                alt="Frame B"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
                  activeBlinkSlot === 'B' ? 'opacity-100' : 'opacity-0'
                }`}
                draggable="false"
              />
            </>
          ) : (
            <img
              key={currentSingleFrame?.id || currentIndex}
              src={currentSingleFrame?.url}
              alt={currentSingleFrame?.id || 'Celestial Frame'}
              className="w-full h-full object-cover"
              draggable="false"
            />
          )}
        </div>

        {/* Trajectory / Object Position Overlay inside transformed space */}
        <TrailOverlay
          frames={frames}
          currentIndex={activeDisplayIndex}
          showTrail={showTrail}
          showReticle={showReticle}
          targetName={targetName}
        />
      </div>

      {/* Optical Vignette */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] z-20" />
    </div>
  );
}
