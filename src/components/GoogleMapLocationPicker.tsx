import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Search,
  Building,
  Home,
  FileText,
  AlertCircle,
  RefreshCw,
  Layers,
  Compass
} from 'lucide-react';
import {
  CustomerLocationDetails,
  detectCurrentCoordinates,
  reverseGeocodeLatLng,
  getGoogleMapsEmbedUrl,
  getGoogleMapsDirectionsUrl,
  saveCustomerLocation,
  getSavedCustomerLocation,
  DEFAULT_NZ_COORDS
} from '../services/locationService';
import { NZ_SUBURBS_LIST } from '../data/mockData';

interface GoogleMapLocationPickerProps {
  initialAddress?: string;
  onAddressConfirmed: (formattedAddress: string, details: CustomerLocationDetails) => void;
  onCancel?: () => void;
  buttonLabel?: string;
}

export const GoogleMapLocationPicker: React.FC<GoogleMapLocationPickerProps> = ({
  initialAddress,
  onAddressConfirmed,
  onCancel,
  buttonLabel = 'Confirm Delivery Address'
}) => {
  const saved = getSavedCustomerLocation();

  // State management
  const [streetAddress, setStreetAddress] = useState(
    saved?.streetName || initialAddress || '142 Ponsonby Road'
  );
  const [apartmentUnit, setApartmentUnit] = useState(saved?.unit || '');
  const [suburb, setSuburb] = useState(saved?.suburb || 'Ponsonby');
  const [city, setCity] = useState(saved?.city || 'Auckland');
  const [postcode, setPostcode] = useState(saved?.postcode || '1011');
  const [deliveryNotes, setDeliveryNotes] = useState(saved?.deliveryNotes || '');

  // GPS Coordinates & Status
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    saved?.latitude && saved?.longitude ? { latitude: saved.latitude, longitude: saved.longitude } : null
  );
  const [accuracy, setAccuracy] = useState<number | null>(saved?.accuracy || null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectionSuccess, setDetectionSuccess] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Map Embed Query State
  const [mapQuery, setMapQuery] = useState<string | { latitude: number; longitude: number }>(
    coords || initialAddress || '142 Ponsonby Road, Ponsonby, Auckland'
  );
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Handle GPS detection
  const handleDetectGPS = async () => {
    setIsDetectingLocation(true);
    setGpsError(null);
    setDetectionSuccess(false);

    try {
      const position = await detectCurrentCoordinates();
      setCoords({ latitude: position.latitude, longitude: position.longitude });
      setAccuracy(position.accuracy);

      // Update map embed immediately to exact coordinates
      setMapQuery({ latitude: position.latitude, longitude: position.longitude });

      // Reverse geocode to street address
      const locationDetails = await reverseGeocodeLatLng(position.latitude, position.longitude);

      if (locationDetails.streetName || locationDetails.streetNumber) {
        const fullStreet = [locationDetails.streetNumber, locationDetails.streetName].filter(Boolean).join(' ');
        setStreetAddress(fullStreet);
      }
      if (locationDetails.suburb) setSuburb(locationDetails.suburb);
      if (locationDetails.city) setCity(locationDetails.city);
      if (locationDetails.postcode) setPostcode(locationDetails.postcode);

      setDetectionSuccess(true);
      setTimeout(() => setDetectionSuccess(false), 5000);
    } catch (err: any) {
      console.error('[GoogleMapLocationPicker] Geolocation error:', err);
      setGpsError(err.message || 'Unable to access your GPS location.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Update map when street or suburb changes (debounced effect)
  useEffect(() => {
    if (!coords || !detectionSuccess) {
      const timer = setTimeout(() => {
        const queryStr = [streetAddress, suburb, city, 'New Zealand'].filter(Boolean).join(', ');
        if (queryStr.length > 5) {
          setMapQuery(queryStr);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [streetAddress, suburb, city]);

  // Handle Form Submission
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = [
      apartmentUnit ? `Unit ${apartmentUnit}` : null,
      streetAddress,
      suburb,
      city,
      postcode
    ].filter(Boolean).join(', ');

    const details: CustomerLocationDetails = {
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      accuracy: accuracy || undefined,
      formattedAddress: fullAddress,
      streetName: streetAddress,
      unit: apartmentUnit,
      suburb,
      city,
      postcode,
      deliveryNotes,
      isGpsDetected: !!coords
    };

    saveCustomerLocation(details);
    onAddressConfirmed(fullAddress, details);
  };

  const currentFormattedString = [streetAddress, suburb, city].filter(Boolean).join(', ');

  return (
    <form onSubmit={handleConfirm} className="space-y-4">
      {/* Geolocation Trigger Banner */}
      <div className="bg-gradient-to-r from-[#FAF0ED] via-[#FDF5F2] to-amber-50/50 p-4 rounded-2xl border border-[#E06D53]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E06D53] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1E1B18] flex items-center gap-1.5">
              <span>Automatic Location Detection</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E06D53]/15 text-[#C95338] font-bold uppercase">
                GPS Powered
              </span>
            </h4>
            <p className="text-[11px] text-[#706658] mt-0.5">
              Get your precise delivery location using your device’s GPS & Google Maps.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isDetectingLocation}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E06D53] hover:bg-[#D45E44] text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-75"
        >
          {isDetectingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Locating You...</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Use Current GPS Location</span>
            </>
          )}
        </button>
      </div>

      {/* GPS Status feedback */}
      {detectionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <strong>Location Detected!</strong> Coordinates:{' '}
            <span className="font-mono text-[11px]">
              {coords?.latitude.toFixed(4)}, {coords?.longitude.toFixed(4)}
            </span>{' '}
            {accuracy && <span className="text-emerald-700">(Accurate to ±{accuracy}m)</span>}
          </div>
        </div>
      )}

      {gpsError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{gpsError}</span>
          </div>
        </div>
      )}

      {/* Interactive Google Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#D9CFBF] shadow-sm bg-[#EBE3D5] group">
        {/* Top Floating Info Bar on Map */}
        <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-[#E2D8C9] flex items-center gap-2 text-xs font-bold text-[#1E1B18] pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#E06D53] animate-ping" />
            <MapPin className="w-3.5 h-3.5 text-[#E06D53]" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{currentFormattedString || 'New Zealand'}</span>
          </div>

          <a
            href={getGoogleMapsDirectionsUrl(currentFormattedString)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/95 hover:bg-white backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-[#E2D8C9] flex items-center gap-1.5 text-[11px] font-bold text-[#1E1B18] hover:text-[#E06D53] transition-colors pointer-events-auto cursor-pointer"
            title="Open in Google Maps application"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in Google Maps</span>
          </a>
        </div>

        {/* Embedded Google Map Iframe */}
        <div className="w-full h-48 sm:h-64 relative bg-[#EFE9DF]">
          <iframe
            title="Google Maps Delivery Location"
            src={getGoogleMapsEmbedUrl(mapQuery, 16)}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsMapLoading(false)}
          />

          {/* Centered Map Pin Marker Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#E06D53] text-white shadow-lg flex items-center justify-center border-2 border-white transform transition-transform group-hover:scale-110">
                <MapPin className="w-5 h-5 fill-white" />
              </div>
              <div className="w-2.5 h-1 bg-black/30 rounded-full blur-[1px] mx-auto mt-0.5" />
            </div>
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="bg-[#FAF7F2] px-3 py-1.5 border-t border-[#E8E0D2] flex items-center justify-between text-[11px] text-[#706658]">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#E06D53]" />
            <span>Interactive Google Map view with delivery radius</span>
          </div>
          <span className="hidden sm:inline text-neutral-400">Piping-hot delivery to this address</span>
        </div>
      </div>

      {/* Complete Address Customization Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[#E06D53]" />
            <span>Refine Complete Delivery Address</span>
          </label>
          <span className="text-[11px] text-[#8C8275]">Customer will confirm before delivery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Street Address */}
          <div className="sm:col-span-8">
            <label className="block text-[11px] font-semibold text-[#706658] mb-1">
              Street Address & Number *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-[#8C8275] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="location-picker-street"
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. 142 Ponsonby Road"
                className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] placeholder-[#9E9486] focus:outline-none focus:border-[#E06D53]"
              />
            </div>
          </div>

          {/* Unit / Flat Number */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-semibold text-[#706658] mb-1">
              Apartment / Unit / Flat
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-[#8C8275] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="location-picker-unit"
                type="text"
                value={apartmentUnit}
                onChange={(e) => setApartmentUnit(e.target.value)}
                placeholder="e.g. Unit 4B / Flat 2"
                className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] placeholder-[#9E9486] focus:outline-none focus:border-[#E06D53]"
              />
            </div>
          </div>

          {/* Suburb */}
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-semibold text-[#706658] mb-1">
              Suburb *
            </label>
            <input
              id="location-picker-suburb"
              type="text"
              required
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              placeholder="e.g. Ponsonby, CBD, Mount Eden"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
            />
          </div>

          {/* City */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-semibold text-[#706658] mb-1">
              City *
            </label>
            <input
              id="location-picker-city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Auckland, Christchurch"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
            />
          </div>

          {/* NZ Postcode */}
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-[#706658] mb-1">
              Postcode
            </label>
            <input
              id="location-picker-postcode"
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="e.g. 1011"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
            />
          </div>
        </div>

        {/* Quick NZ Suburb Selectors */}
        <div>
          <span className="text-[11px] text-[#7A7063] font-medium block mb-1.5">
            Quick NZ Delivery Areas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {NZ_SUBURBS_LIST.slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSuburb(s)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                  suburb === s
                    ? 'bg-[#E06D53] text-white border-[#E06D53]'
                    : 'bg-[#FAF7F2] text-[#5A5043] border-[#E8E0D2] hover:border-[#D9CFBF]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Driver Instructions */}
        <div>
          <label className="block text-[11px] font-semibold text-[#706658] mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3 text-[#E06D53]" />
            <span>Driver Delivery Instructions / Gate Code (Optional)</span>
          </label>
          <input
            id="location-picker-notes"
            type="text"
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            placeholder="e.g. Leave on front porch, gate code is 1234, ring bell"
            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] placeholder-[#9E9486] focus:outline-none focus:border-[#E06D53]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 py-3 px-4 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#706658] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#E2D8C9]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          id="confirm-google-maps-location-btn"
          className="flex-1 py-3 px-4 bg-[#E06D53] hover:bg-[#D45E44] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </form>
  );
};
