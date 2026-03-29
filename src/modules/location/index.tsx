import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Search, Locate, Loader2, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useLocations } from '@/modules/location/api/fetchLocations';

type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

function MapFlyTo({ centre, zoom }: { centre: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(centre, zoom, { duration: 1.2 });
  }, [map, centre, zoom]);
  return null;
}

const pinIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:oklch(0.72 0.19 41);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);transform:rotate(-45deg)"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

const userIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,.25),0 2px 6px rgba(0,0,0,.25)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function Location() {
  const DEFAULT_CENTRE: [number, number] = [48.1371, 11.8759];
  const { locations } = useLocations();

  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [mapCentre, setMapCentre] = useState<[number, number]>(DEFAULT_CENTRE);
  const [mapZoom, setMapZoom] = useState(6);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // No auto-request on mount — user must click "Use my location" explicitly.

  const requestGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setMapCentre(coords);
        setMapZoom(13);
        setGeoStatus('granted');
      },
      () => setGeoStatus('denied'),
      { timeout: 10000 },
    );
  }, []);

  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const q = query.trim();
      if (!q) return;
      setSearchError('');
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
          { headers: { 'Accept-Language': 'en' } },
        );
        const data: NominatimResult[] = await res.json();
        if (data.length === 0) {
          setSearchError('No results found. Try a more specific address.');
        } else {
          setMapCentre([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setMapZoom(13);
          inputRef.current?.blur();
        }
      } catch {
        setSearchError('Could not reach geocoding service. Check your connection.');
      } finally {
        setSearching(false);
      }
    },
    [query],
  );

  const handleUseLocation = () => {
    if (geoStatus === 'granted' && userPos) {
      setMapCentre(userPos);
      setMapZoom(13);
      setQuery('');
    } else {
      requestGeo();
    }
  };

  const geoLabel = () => {
    if (geoStatus === 'requesting') return 'Locating…';
    if (geoStatus === 'granted') return 'My location';
    return 'Use my location';
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Toolbar ── */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-2">
        <div className="flex gap-2">
          {/* Address search */}
          <form onSubmit={handleSearch} className="relative flex-1 flex items-center">
            <span className="absolute left-3 text-muted pointer-events-none">
              {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Search an address…"
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-overlay focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:text-muted transition-shadow"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSearchError('');
                }}
                className="absolute right-2 p-1 rounded-full text-muted hover:text-foreground transition-colors"
                aria-label="Clear"
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Use my location — always visible, not hidden behind focus */}
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={geoStatus === 'requesting'}
            className={[
              'shrink-0 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border transition-colors',
              geoStatus === 'granted'
                ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:bg-blue-950/40 dark:hover:bg-blue-950/60'
                : 'border-[var(--accent)]/40 text-[var(--accent)] bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50',
              geoStatus === 'requesting' ? 'opacity-60 cursor-not-allowed' : '',
            ].join(' ')}
            aria-label="Use my location"
          >
            {geoStatus === 'requesting' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Locate size={14} />
            )}
            <span className="hidden sm:inline">{geoLabel()}</span>
          </button>
        </div>

        {/* Denied feedback */}
        {geoStatus === 'denied' && (
          <p className="text-xs text-muted">
            Location access was denied. Allow it in browser settings then{' '}
            <button
              onClick={requestGeo}
              className="text-[var(--accent)] hover:underline underline-offset-2"
            >
              try again
            </button>
            .
          </p>
        )}
        {geoStatus === 'unavailable' && (
          <p className="text-xs text-muted">
            Geolocation is not supported. Search by address instead.
          </p>
        )}
        {searchError && <p className="text-xs text-red-600 dark:text-red-400">{searchError}</p>}
      </div>

      {/* ── Map ── */}
      {/* `isolate` creates a new stacking context so Leaflet's z-indexes (up to 1000)
          are scoped inside the map and don't bleed over drawer/modal portals. */}
      <div className="flex-1 min-h-0 mx-4 mb-4 rounded-xl overflow-hidden border border-border isolate">
        <MapContainer center={DEFAULT_CENTRE} zoom={6} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFlyTo centre={mapCentre} zoom={mapZoom} />

          {userPos && (
            <Marker position={userPos} icon={userIcon}>
              <Popup>
                <span className="text-sm font-medium">You are here</span>
              </Popup>
            </Marker>
          )}

          {locations
            .filter((loc) => loc.latitude !== undefined && loc.longitude !== undefined)
            .map((loc) => (
              <Marker key={loc.id} position={[loc.latitude!, loc.longitude!]} icon={pinIcon}>
                <Popup>
                  <div className="flex flex-col gap-0.5 text-sm min-w-[140px]">
                    <span className="font-semibold">{loc.name}</span>
                    {loc.address?.street && <span>{loc.address.street}</span>}
                    {(loc.address?.zipCode || loc.address?.city) && (
                      <span>
                        {loc.address.zipCode} {loc.address.city}
                      </span>
                    )}
                    {loc.phoneNumber && (
                      <a
                        href={`tel:${loc.phoneNumber}`}
                        className="text-[var(--accent)] hover:underline mt-1"
                      >
                        {loc.phoneNumber}
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Location;
