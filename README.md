# SkyBlink Frontend (Observatory UI)

Interactive React 19 + Tailwind CSS + Vite web client for the **SkyBlink** NASA Space Apps 2026 project.

## 🔭 Key Features
* **Telescope Eyepiece (`EyepieceFrame`):** Circular aperture simulation with celestial HUD telemetry.
* **Blink Comparator (`BlinkControl` & `FrameViewer`):** Zero-flicker opacity-based astronomical comparison.
* **Scrubbing Time Slider (`TimeSlider`):** Keyboard-supported timeline scrubber with autoplay.
* **Motion Trail (`TrailOverlay`):** Vector trajectory overlay tracking object motion.
* **Guided Stories (`StoryCards`):** Step-by-step bilingual (Arabic & English) educational walkthroughs.
* **Celestial Sky Map (`SkyPicker`):** Equatorial sky sphere with galactic plane and target pins.

## 🚀 Running the Frontend
```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:3000

# Build for production (e.g. for Vercel/Netlify)
npm run build
```

## ⚙️ Configuration
The frontend automatically proxies `/api` and `/frames` to `http://localhost:4000` when the backend is active, and seamlessly falls back to bundled static data if running offline or standalone.
