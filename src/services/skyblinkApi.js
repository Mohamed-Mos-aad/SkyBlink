/**
 * SkyBlink Backend API Client
 * Connects directly to the live deployed SkyBlink Express backend
 * with resilient offline fallbacks and NASA JPL Small-Body integration.
 */
import { FALLBACK_TARGETS } from '../data/fallbackManifest';

// Deployed Vercel Backend URL (CORS is enabled with Access-Control-Allow-Origin: *)
export const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'https://skyblink-backend.vercel.app';

const API_BASE = BACKEND_URL;

/**
 * Health Check: Check if backend server is online & how many targets are loaded.
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * List All Featured Targets
 */
export async function getFeaturedTargets() {
  try {
    const res = await fetch(`${API_BASE}/api/targets`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to fetch targets: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    throw new Error('Empty targets array');
  } catch (err) {
    console.info('Backend targets API unreachable. Using bundled fallback targets.');
    return FALLBACK_TARGETS;
  }
}

/**
 * Get Single Target Details & Multi-Epoch Frames
 * Supports Backend Dynamic Self-Resolution (fetches any object from NASA JPL in real-time)
 */
export async function getTargetDetails(targetId) {
  try {
    const res = await fetch(`${API_BASE}/api/targets/${encodeURIComponent(targetId)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Target not found via API: ${res.status}`);
    return await res.json();
  } catch (err) {
    // Local fallback matching
    const fallback =
      FALLBACK_TARGETS.find((t) => t.id === targetId) ||
      FALLBACK_TARGETS[0];
    return fallback;
  }
}

/**
 * Live Search & Autocomplete
 * Queries local catalog + NASA JPL Small-Body Database + CDS Sesame in real time.
 */
export async function searchTargetSuggestions(query, category = 'all', limit = 30) {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query.trim(),
      category: category || 'all',
      limit: String(limit),
    });

    const res = await fetch(`${API_BASE}/api/search/suggest?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`Search API returned status ${res.status}`);
    const suggestions = await res.json();
    if (Array.isArray(suggestions)) {
      return suggestions;
    }
    return [];
  } catch (err) {
    // Offline local fallback search
    const q = query.toLowerCase().trim();
    return FALLBACK_TARGETS.filter((t) => {
      const catMatch =
        category === 'all' ||
        !t.category ||
        t.category === category ||
        (category === 'comet' && (t.id.includes('atlas') || t.name.toLowerCase().includes('comet'))) ||
        (category === 'asteroid' && t.name.toLowerCase().includes('asteroid'));
      
      const textMatch =
        t.name?.toLowerCase().includes(q) ||
        t.fullName?.toLowerCase().includes(q) ||
        t.blurb?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q) ||
        String(t.ra).includes(q) ||
        String(t.dec).includes(q);

      return catMatch && textMatch;
    }).map((t) => ({
      id: t.id,
      name: t.name,
      designation: t.fullName || t.name,
      category: t.category || 'asteroid',
      ra: t.ra,
      dec: t.dec,
      sizeDeg: t.sizeDeg || 0.15,
      blurb: t.blurb,
      isPrecached: true,
      isExternal: false,
    }));
  }
}

/**
 * Fetch Full Curated Catalog (60+ verified astronomical targets)
 */
export async function getFullCatalog() {
  try {
    const res = await fetch(`${API_BASE}/api/catalog`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Catalog API returned ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return FALLBACK_TARGETS;
  } catch (err) {
    return FALLBACK_TARGETS;
  }
}

/**
 * Resolve Arbitrary Celestial Name or Coordinates
 */
export async function resolveCelestialCoordinates(queryOrCoords) {
  try {
    const res = await fetch(`${API_BASE}/api/search/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(queryOrCoords),
    });
    if (!res.ok) throw new Error(`Resolve API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}
