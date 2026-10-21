"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import {
  Search,
  Crosshair,
  Loader2,
  MapPin,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface AddressMapModalContentProps {
  initialLat?: number | null;
  initialLng?: number | null;
  formAddressQuery?: string;
  formFallbackQuery?: string;
  onConfirm: (lat: number, lng: number) => void;
  onClose: () => void;
}

const DEFAULT_SLEMAN_LAT = -7.7178025;
const DEFAULT_SLEMAN_LNG = 110.3544013;
const DEFAULT_ZOOM = 13;
const PINNED_ZOOM = 16;

const createCustomMarker = () => {
  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="position: relative; width: 38px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: grab;">
        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 14px; height: 5px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1.5px);"></div>
        <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 34px; height: 34px; background: #F7620A; border: 3px solid white; border-radius: 50% 50% 50% 0; transform: translateX(-50%) rotate(-45deg); box-shadow: 0 4px 14px rgba(247,98,10,0.5); display: flex; align-items: center; justify-content: center;">
          <div style="width: 11px; height: 11px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
      </div>
    `,
    iconSize: [38, 44],
    iconAnchor: [19, 44],
    popupAnchor: [0, -44],
  });
};

export default function AddressMapModalContent({
  initialLat,
  initialLng,
  formAddressQuery = "",
  formFallbackQuery = "",
  onConfirm,
  onClose,
}: AddressMapModalContentProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const hasInitialCoords =
    typeof initialLat === "number" &&
    typeof initialLng === "number" &&
    !isNaN(initialLat) &&
    !isNaN(initialLng) &&
    (initialLat !== 0 || initialLng !== 0);

  const [currentLat, setCurrentLat] = useState<number>(
    hasInitialCoords ? (initialLat as number) : DEFAULT_SLEMAN_LAT
  );
  const [currentLng, setCurrentLng] = useState<number>(
    hasInitialCoords ? (initialLng as number) : DEFAULT_SLEMAN_LNG
  );
  const [locationName, setLocationName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Reverse geocode to get human-readable location preview
  const fetchAddressName = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "id,en" } }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.display_name) {
        setLocationName(data.display_name);
      }
    } catch {
      // ignore network errors for preview
    }
  }, []);

  // Update marker & map position
  const setMarkerCoords = useCallback(
    (lat: number, lng: number, zoomLevel?: number, updateReverse = true) => {
      setCurrentLat(lat);
      setCurrentLng(lng);

      const map = mapInstanceRef.current;
      if (map) {
        if (zoomLevel) {
          map.setView([lat, lng], zoomLevel, { animate: true });
        } else {
          map.panTo([lat, lng], { animate: true });
        }
      }

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else if (map) {
        const marker = L.marker([lat, lng], {
          icon: createCustomMarker(),
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          setMarkerCoords(pos.lat, pos.lng, undefined, true);
        });

        markerRef.current = marker;
      }

      if (updateReverse) {
        fetchAddressName(lat, lng);
      }
    },
    [fetchAddressName]
  );

  // Search geocode via Nominatim
  const executeSearch = useCallback(
    async (query: string, isAutoInitial = false) => {
      const cleanQuery = query.trim();
      if (!cleanQuery) return false;

      setIsSearching(true);
      if (isAutoInitial) {
        setStatusMessage("Mencari titik lokasi dari alamat yang Anda masukkan...");
      }

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(
          cleanQuery
        )}`;
        const res = await fetch(url, {
          headers: { "Accept-Language": "id,en" },
        });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lon);
          setMarkerCoords(lat, lng, PINNED_ZOOM, false);
          setLocationName(first.display_name || cleanQuery);
          if (isAutoInitial) {
            setStatusMessage("Titik lokasi disesuaikan dengan alamat input Anda.");
          } else {
            setStatusMessage(null);
            toast.success("Lokasi ditemukan!");
          }
          return true;
        }

        // Fallback search jika query terlalu spesifik
        if (formFallbackQuery && formFallbackQuery !== cleanQuery) {
          const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(
            formFallbackQuery
          )}`;
          const fbRes = await fetch(fallbackUrl, {
            headers: { "Accept-Language": "id,en" },
          });
          const fbData = await fbRes.json();

          if (Array.isArray(fbData) && fbData.length > 0) {
            const first = fbData[0];
            const lat = parseFloat(first.lat);
            const lng = parseFloat(first.lon);
            setMarkerCoords(lat, lng, PINNED_ZOOM, false);
            setLocationName(first.display_name || formFallbackQuery);
            if (isAutoInitial) {
              setStatusMessage("Diarahkan ke wilayah kelurahan/kapanewon alamat Anda.");
            } else {
              toast.info("Diarahkan ke wilayah kelurahan/kapanewon terdekat.");
            }
            return true;
          }
        }

        if (!isAutoInitial) {
          toast.error("Lokasi tidak ditemukan. Coba gunakan nama jalan atau area yang lebih umum.");
        }
        return false;
      } catch (err) {
        console.error("Nominatim search error:", err);
        if (!isAutoInitial) {
          toast.error("Gagal melakukan pencarian lokasi.");
        }
        return false;
      } finally {
        setIsSearching(false);
      }
    },
    [formFallbackQuery, setMarkerCoords]
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = hasInitialCoords
      ? [initialLat as number, initialLng as number]
      : [DEFAULT_SLEMAN_LAT, DEFAULT_SLEMAN_LNG];
    const initialZoom = hasInitialCoords ? PINNED_ZOOM : DEFAULT_ZOOM;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Initial marker
    const marker = L.marker(initialCenter, {
      icon: createCustomMarker(),
      draggable: true,
    }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      setMarkerCoords(pos.lat, pos.lng, undefined, true);
    });

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Click map to reposition marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      setMarkerCoords(e.latlng.lat, e.latlng.lng, undefined, true);
    });

    // Invalidate size to ensure tiles render when modal opens
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // If initial coordinates exist, fetch address preview
    if (hasInitialCoords) {
      fetchAddressName(initialLat as number, initialLng as number);
    } else {
      // Pada saat create (atau saat belum ada koordinat tersimpan):
      // Gunakan search sesuai alamat yang di-input customer sebagai titik awal lokasi!
      if (formAddressQuery && formAddressQuery.trim()) {
        setSearchQuery(formAddressQuery);
        executeSearch(formAddressQuery, true);
      }
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [hasInitialCoords, initialLat, initialLng, formAddressQuery, setMarkerCoords, fetchAddressName, executeSearch]);

  // Handler for Current Geolocation
  const handleCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Perangkat Anda tidak mendukung fitur deteksi lokasi.");
      return;
    }

    setIsLocating(true);
    setStatusMessage("Mendeteksi koordinat GPS perangkat Anda...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setStatusMessage(null);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarkerCoords(lat, lng, PINNED_ZOOM, true);
        toast.success("Berhasil menemukan lokasi GPS Anda!");
      },
      (err) => {
        setIsLocating(false);
        setStatusMessage(null);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Izin akses lokasi ditolak oleh browser atau pengaturan sistem.");
        } else {
          toast.error("Tidak dapat mendeteksi sinyal GPS lokasi saat ini.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handler to search by form address
  const handleSearchByFormAddress = () => {
    if (!formAddressQuery || !formAddressQuery.trim()) {
      toast.info("Silakan isi alamat lengkap atau pilih kelurahan/kapanewon terlebih dahulu.");
      return;
    }
    setSearchQuery(formAddressQuery);
    executeSearch(formAddressQuery, false);
  };

  const handleConfirm = () => {
    onConfirm(currentLat, currentLng);
    toast.success("Titik lokasi koordinat berhasil ditentukan!");
  };

  return (
    <div className="flex flex-col h-full max-h-[88vh] bg-white text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-orange-100/80 bg-gradient-to-r from-orange-50/50 via-white to-orange-50/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <MapPin size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">
              Pilih Titik Koordinat Alamat
            </h3>
            <p className="text-[11px] text-slate-500">
              Geser pin atau klik peta untuk menentukan titik pengiriman yang akurat
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Search & Actions Bar */}
      <div className="p-3.5 border-b border-slate-100 space-y-2 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  executeSearch(searchQuery, false);
                }
              }}
              placeholder="Cari lokasi, jalan, atau patokan..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <button
            type="button"
            onClick={() => executeSearch(searchQuery, false)}
            disabled={isSearching || !searchQuery.trim()}
            className="h-9 px-3.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            {isSearching ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Search size={13} />
            )}
            Cari
          </button>
        </div>

        {/* Quick Location Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {formAddressQuery ? (
            <button
              type="button"
              onClick={handleSearchByFormAddress}
              disabled={isSearching}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 font-medium transition border border-orange-200/60"
            >
              <RotateCcw size={12} />
              Cari Alamat Form
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white text-slate-700 hover:bg-slate-100 font-medium transition border border-slate-200 shadow-2xs"
          >
            {isLocating ? (
              <Loader2 size={12} className="animate-spin text-orange-500" />
            ) : (
              <Crosshair size={12} className="text-orange-500" />
            )}
            Lokasi Saya (GPS)
          </button>

          {statusMessage && (
            <span className="text-[11px] text-orange-600 font-medium animate-pulse ml-auto">
              {statusMessage}
            </span>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 min-h-[340px] md:min-h-[400px] w-full bg-slate-100">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Overlay tip */}
        <div className="absolute top-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200/70 text-[11px] text-slate-600 flex items-center gap-1.5 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>Klik atau geser pin untuk mengubah koordinat</span>
        </div>
      </div>

      {/* Footer Info & Confirmation */}
      <div className="p-4 border-t border-slate-100 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <MapPin size={13} className="text-orange-600 shrink-0" />
              <span className="truncate">
                {locationName || "Titik terpilih pada peta"}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Lat: {currentLat.toFixed(6)}, Lng: {currentLng.toFixed(6)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-orange-700 font-semibold shrink-0">
            <Check size={13} />
            <span>Pin siap digunakan</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <Check size={14} />
            Gunakan Titik Lokasi Ini
          </button>
        </div>
      </div>
    </div>
  );
}
