"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Navigation, X, CheckCircle2, Loader2, Compass } from "lucide-react";

const AddressMapModalContent = dynamic(
  () => import("./AddressMapModalContent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-80 bg-slate-50 text-slate-500 gap-3">
        <Loader2 size={32} className="animate-spin text-orange-500" />
        <span className="text-xs font-medium">Memuat peta interaktif...</span>
      </div>
    ),
  }
);

export interface DetectedAddressDetails {
  displayName?: string;
  road?: string;
  village?: string;
  cityDistrict?: string;
  district?: string;
  county?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

interface AddressLocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect: (
    lat: number,
    lng: number,
    detectedDetails?: DetectedAddressDetails
  ) => void;
  onLocationClear?: () => void;
  formAddressQuery?: string;
  formFallbackQuery?: string;
}

export function AddressLocationPicker({
  latitude,
  longitude,
  onLocationSelect,
  onLocationClear,
  formAddressQuery = "",
  formFallbackQuery = "",
}: AddressLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    (latitude !== 0 || longitude !== 0);

  const handleConfirm = (
    lat: number,
    lng: number,
    detectedDetails?: DetectedAddressDetails
  ) => {
    onLocationSelect(lat, lng, detectedDetails);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: "var(--text-secondary, #4A3728)",
          }}
          className="flex items-center gap-1.5"
        >
          <Compass size={15} style={{ color: "var(--terracotta, #F7620A)" }} />
          <span>Titik Koordinat Lokasi (Peta)</span>
        </label>
        {hasCoordinates && onLocationClear && (
          <button
            type="button"
            onClick={onLocationClear}
            className="text-xs text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1 transition"
          >
            <X size={13} />
            Hapus Titik
          </button>
        )}
      </div>

      <div
        style={{
          border: "1.5px solid var(--cream-dark, #F0D5C2)",
          borderRadius: 12,
          background: hasCoordinates ? "rgba(247,98,10,0.03)" : "white",
        }}
        className="p-3.5 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: hasCoordinates
                  ? "rgba(39, 174, 96, 0.12)"
                  : "rgba(247, 98, 10, 0.1)",
                color: hasCoordinates ? "#27AE60" : "var(--terracotta, #F7620A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {hasCoordinates ? <CheckCircle2 size={18} /> : <MapPin size={18} />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {hasCoordinates
                  ? "Pin Titik Koordinat Tersimpan"
                  : "Belum Ada Titik Lokasi Peta"}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {hasCoordinates ? (
                  <span className="font-mono text-slate-600">
                    Latitude: {Number(latitude).toFixed(6)}, Longitude: {Number(longitude).toFixed(6)}
                  </span>
                ) : (
                  "Tentukan pin titik lokasi di peta agar kurir lebih mudah menemukan alamat Anda"
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              height: 36,
              borderRadius: 8,
              background: hasCoordinates ? "white" : "var(--terracotta, #F7620A)",
              color: hasCoordinates ? "var(--terracotta, #F7620A)" : "white",
              border: hasCoordinates
                ? "1.5px solid var(--terracotta, #F7620A)"
                : "none",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "0 14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              boxShadow: hasCoordinates ? "none" : "0 2px 8px rgba(247,98,10,0.25)",
              flexShrink: 0,
            }}
            className="hover:opacity-90 active:scale-95 transition"
          >
            <Navigation size={13} />
            {hasCoordinates ? "Ubah Titik Lokasi" : "Pilih di Peta"}
          </button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-2xl w-[94vw] p-0 overflow-hidden rounded-2xl border-none shadow-2xl"
        >
          <DialogTitle className="sr-only">Pilih Titik Lokasi Alamat</DialogTitle>
          <AddressMapModalContent
            initialLat={latitude}
            initialLng={longitude}
            formAddressQuery={formAddressQuery}
            formFallbackQuery={formFallbackQuery}
            onConfirm={handleConfirm}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default AddressLocationPicker;
