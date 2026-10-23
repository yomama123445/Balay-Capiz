/**
 * BalayCapiz — Cross-Platform Native Bridge (Capacitor Android/iOS + Web Fallbacks)
 * Provides unified access to GPS Geolocation, Haversine Campus Distance Calculation,
 * Native Share Sheet, and Platform Detection without breaking web builds.
 */

import { BoardingHouseListing, CAMPUSES, CampusId } from '../data/roxasHousingData';

interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => 'ios' | 'android' | 'web';
  Plugins?: {
    Geolocation?: {
      getCurrentPosition: (options?: {
        enableHighAccuracy?: boolean;
        timeout?: number;
      }) => Promise<{
        coords: { latitude: number; longitude: number; accuracy: number };
      }>;
    };
    Share?: {
      share: (options: {
        title?: string;
        text?: string;
        url?: string;
        dialogTitle?: string;
      }) => Promise<void>;
    };
  };
}

function getCapacitor(): CapacitorGlobal | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor || null;
}

export function isRunningInNativeApp(): boolean {
  const cap = getCapacitor();
  return Boolean(cap?.isNativePlatform?.());
}

export function getRuntimePlatform(): 'android' | 'ios' | 'pwa' | 'web' {
  const cap = getCapacitor();
  if (cap?.isNativePlatform?.()) {
    const plat = cap.getPlatform?.();
    if (plat === 'android' || plat === 'ios') return plat;
  }
  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true)
  ) {
    return 'pwa';
  }
  return 'web';
}

/**
 * Calculates great-circle distance in meters between two GPS coordinates in Roxas City.
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface UserLocationResult {
  lat: number;
  lng: number;
  accuracyMeters: number;
  nearestCampusId: Exclude<CampusId, 'all'>;
  nearestCampusDistanceMeters: number;
  isWithinRoxasBounds: boolean;
}

/**
 * Fetches current GPS coordinates via Capacitor Native Geolocation or Web Geolocation API
 * and resolves the nearest Roxas City university gate.
 */
export async function locateStudentPosition(): Promise<{
  location: UserLocationResult | null;
  error: string | null;
}> {
  try {
    let lat = 0;
    let lng = 0;
    let accuracy = 0;

    const cap = getCapacitor();
    if (cap?.isNativePlatform?.() && cap.Plugins?.Geolocation) {
      const pos = await cap.Plugins.Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      accuracy = Math.round(pos.coords.accuracy);
    } else if (typeof navigator !== 'undefined' && navigator.geolocation) {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      accuracy = Math.round(pos.coords.accuracy);
    } else {
      return {
        location: null,
        error: 'Geolocation is not supported on this device/browser.',
      };
    }

    // Check if coordinates are within Greater Roxas City / Capiz bounding box
    const isWithinRoxasBounds =
      lat >= 11.48 && lat <= 11.65 && lng >= 122.68 && lng <= 122.84;

    let nearestCampus = CAMPUSES[0];
    let minDistance = calculateDistanceMeters(lat, lng, nearestCampus.lat, nearestCampus.lng);

    for (const campus of CAMPUSES) {
      const dist = calculateDistanceMeters(lat, lng, campus.lat, campus.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestCampus = campus;
      }
    }

    return {
      location: {
        lat,
        lng,
        accuracyMeters: accuracy,
        nearestCampusId: nearestCampus.id,
        nearestCampusDistanceMeters: minDistance,
        isWithinRoxasBounds,
      },
      error: null,
    };
  } catch (err) {
    return {
      location: null,
      error:
        err instanceof Error
          ? err.message
          : 'Could not read GPS location. Please allow location access.',
    };
  }
}

/**
 * Triggers native share sheet (Android/iOS/Mobile Web) or copies formatted summary to clipboard.
 */
export async function shareListing(
  listing: BoardingHouseListing
): Promise<'shared' | 'copied'> {
  const shareText = `${listing.title} (Brgy. ${listing.barangay}, Roxas City) — ₱${listing.monthlyRentPhp.toLocaleString()}/mo · ${listing.distanceMeters}m to campus · Electricity: ₱${listing.declaredKwhRate.toFixed(2)}/kWh · Contact ${listing.landlordLocalCallName}: ${listing.landlordPhone}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://balaycapiz.vercel.app';

  const cap = getCapacitor();
  if (cap?.isNativePlatform?.() && cap.Plugins?.Share) {
    await cap.Plugins.Share.share({
      title: `BalayCapiz: ${listing.title}`,
      text: shareText,
      url: shareUrl,
      dialogTitle: 'Share Boarding House with Classmates or Parents',
    });
    return 'shared';
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `BalayCapiz: ${listing.title}`,
        text: shareText,
        url: shareUrl,
      });
      return 'shared';
    } catch {
      // User cancelled or share failed; fall back to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(`${shareText} — ${shareUrl}`);
  }
  return 'copied';
}
