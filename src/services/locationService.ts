// Geolocation & Google Maps Location Service for Tiffin & Treat NZ

export interface CustomerLocationDetails {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  formattedAddress: string;
  streetNumber?: string;
  streetName?: string;
  unit?: string;
  suburb: string;
  city: string;
  postcode?: string;
  deliveryNotes?: string;
  isGpsDetected?: boolean;
}

const STORAGE_KEY = 'tt_customer_delivery_location';

// Fallback default coordinates (Ponsonby, Auckland)
export const DEFAULT_NZ_COORDS = {
  latitude: -36.8523,
  longitude: 174.7471,
  city: 'Auckland',
  suburb: 'Ponsonby',
  formattedAddress: '142 Ponsonby Road, Ponsonby, Auckland 1011'
};

/**
 * Promisified browser Geolocation API
 */
export const detectCurrentCoordinates = (): Promise<{ latitude: number; longitude: number; accuracy: number }> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your current browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 10)
        });
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please allow location access in your browser or type your address below.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is currently unavailable on your device.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again or enter your address manually.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Reverse Geocode latitude and longitude to human-readable New Zealand address
 */
export const reverseGeocodeLatLng = async (
  latitude: number,
  longitude: number
): Promise<CustomerLocationDetails> => {
  // 1. Try BigDataCloud Client Reverse Geocoding API (Fast, Free, CORS-friendly client API)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.principalSubdivision || 'Auckland';
      const suburb = data.locality || data.localityInfo?.administrative?.[3]?.name || 'Central';
      const street = data.localityInfo?.informative?.[0]?.name || '';
      const postcode = data.postcode || '';

      const formatted = [street, suburb, city, postcode ? `${postcode}, New Zealand` : 'New Zealand']
        .filter(Boolean)
        .join(', ');

      return {
        latitude,
        longitude,
        formattedAddress: formatted || `${suburb}, ${city}`,
        streetName: street,
        suburb,
        city,
        postcode,
        isGpsDetected: true
      };
    }
  } catch (err) {
    console.warn('[LocationService] Primary reverse geocode failed, falling back to OSM Nominatim', err);
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    const res = await fetch(osmUrl, {
      headers: { 'Accept-Language': 'en' }
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || 'Central';
      const city = addr.city || addr.town || addr.municipality || 'Auckland';
      const road = addr.road || '';
      const houseNumber = addr.house_number || '';
      const postcode = addr.postcode || '';

      const street = houseNumber ? `${houseNumber} ${road}` : road;
      const formatted = [street, suburb, city].filter(Boolean).join(', ');

      return {
        latitude,
        longitude,
        formattedAddress: formatted || data.display_name?.split(',').slice(0, 3).join(',') || `${suburb}, ${city}`,
        streetNumber: houseNumber,
        streetName: road,
        suburb,
        city,
        postcode,
        isGpsDetected: true
      };
    }
  } catch (err) {
    console.warn('[LocationService] Secondary reverse geocode failed', err);
  }

  // 3. Fallback coordinates approximation for Auckland / NZ region
  return {
    latitude,
    longitude,
    formattedAddress: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (New Zealand)`,
    suburb: 'Auckland Central',
    city: 'Auckland',
    isGpsDetected: true
  };
};

/**
 * Generate Google Maps interactive Embed URL
 */
export const getGoogleMapsEmbedUrl = (
  queryOrCoords: string | { latitude: number; longitude: number },
  zoom: number = 16
): string => {
  let query = '';
  if (typeof queryOrCoords === 'object' && queryOrCoords.latitude && queryOrCoords.longitude) {
    query = `${queryOrCoords.latitude},${queryOrCoords.longitude}`;
  } else if (typeof queryOrCoords === 'string' && queryOrCoords.trim()) {
    query = encodeURIComponent(`${queryOrCoords.trim()}, New Zealand`);
  } else {
    query = `${DEFAULT_NZ_COORDS.latitude},${DEFAULT_NZ_COORDS.longitude}`;
  }

  return `https://maps.google.com/maps?q=${query}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
};

/**
 * Generate Google Maps direct directions/navigation link
 */
export const getGoogleMapsDirectionsUrl = (addressOrCoords: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOrCoords)}`;
};

/**
 * Save customer's delivery location details into LocalStorage
 */
export const saveCustomerLocation = (location: CustomerLocationDetails): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      localStorage.setItem('tt_delivery_address', location.formattedAddress);
    }
  } catch (e) {
    console.warn('[LocationService] Failed to save location to localStorage', e);
  }
};

/**
 * Get saved customer delivery location from LocalStorage
 */
export const getSavedCustomerLocation = (): CustomerLocationDetails | null => {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return null;
};
