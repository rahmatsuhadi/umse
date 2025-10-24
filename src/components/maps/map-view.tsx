// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import useSWR from "swr";
// import "leaflet/dist/leaflet.css";
// import {
//   MapContainer,
//   TileLayer,
//   Polyline,
//   CircleMarker,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import type { Map as LeafletMap } from "leaflet";
// import L from "leaflet";
// import { Button } from "@/components/ui/button";
// import { useQuery } from "@tanstack/react-query";

// type Props = {
//   lat: number;
//   lng: number;
//   name: string;
// };

// const fetcher = (url: string) => fetch(url).then((r) => r.json());

// function FitBoundsOnRoute({ coords }: { coords: [number, number][] }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!coords || coords.length < 2) return;
//     const bounds = L.latLngBounds(
//       coords.map(([lat, lng]) => L.latLng(lat, lng))
//     );
//     map.fitBounds(bounds, { padding: [24, 24] });
//   }, [coords, map]);
//   return null;
// }

// export default function MapClient({ lat, lng, name }: Props) {
//   const storePos = useMemo(() => ({ lat, lng }), [lat, lng]);

//   const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
//     null
//   );
//   const [geoLoading, setGeoLoading] = useState(false);
//   const [geoError, setGeoError] = useState<string | null>(null);

//   const mapRef = useRef<LeafletMap | null>(null);

//   const requestGeo = useCallback(() => {
//     if (!("geolocation" in navigator)) {
//       setGeoError("Perangkat tidak mendukung geolokasi.");
//       return;
//     }
//     setGeoLoading(true);
//     setGeoError(null);
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//         setGeoLoading(false);
//       },
//       (err) => {
//         setGeoError(err.message || "Gagal mendapatkan lokasi.");
//         setGeoLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   }, []);

//   // Coba otomatis saat mount
//   useEffect(() => {
//     requestGeo();
//   }, [requestGeo]);

//   const routeKey = userPos
//     ? `/api/osrm?origin=${userPos.lat},${userPos.lng}&dest=${storePos.lat},${storePos.lng}`
//     : null;

//   const {} = useQuery({});

//   const {
//     data: route,
//     isLoading: routeLoading,
//     error: routeError,
//   } = useSWR<
//     | { coordinates: [number, number][]; distance: number; duration: number }
//     | undefined
//   >(routeKey, fetcher);

//   const googleMapsUrl = useMemo(() => {
//     const d = `${storePos.lat},${storePos.lng}`;
//     return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
//       d
//     )}&travelmode=driving`;
//   }, [storePos.lat, storePos.lng]);

//   return (
//     <div className="space-y-4">
//       <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <div>
//             <div className="text-sm text-muted-foreground">Tujuan</div>
//             <div className="text-pretty font-medium">{name}</div>
//             <div className="text-sm text-muted-foreground">
//               {storePos.lat.toFixed(6)}, {storePos.lng.toFixed(6)}
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Button asChild variant="default">
//               <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
//                 Buka di Google Maps
//               </a>
//             </Button>
//             <Button
//               onClick={requestGeo}
//               variant="secondary"
//               disabled={geoLoading}
//             >
//               {geoLoading ? "Mendeteksi lokasi..." : "Gunakan Lokasi Saya"}
//             </Button>
//           </div>
//         </div>
//         {geoError && (
//           <p className="mt-2 text-sm text-destructive">
//             Kesalahan lokasi: {geoError}
//           </p>
//         )}
//       </div>

//       <div className="rounded-lg border border-border">
//         <MapContainer
//           whenCreated={(m) => {
//             mapRef.current = m;
//           }}
//           center={[storePos.lat, storePos.lng]}
//           zoom={15}
//           scrollWheelZoom
//           className="h-[70vh] w-full rounded-lg"
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           {/* Penanda toko */}
//           <CircleMarker
//             center={[storePos.lat, storePos.lng]}
//             radius={10}
//             pathOptions={{
//               color: "var(--color-primary)",
//               fillColor: "var(--color-primary)",
//               fillOpacity: 0.9,
//             }}
//           >
//             <Popup>
//               <div className="text-sm">
//                 <div className="font-medium">{name}</div>
//                 <div>
//                   {storePos.lat.toFixed(6)}, {storePos.lng.toFixed(6)}
//                 </div>
//               </div>
//             </Popup>
//           </CircleMarker>

//           {/* Penanda user (jika tersedia) */}
//           {userPos && (
//             <CircleMarker
//               center={[userPos.lat, userPos.lng]}
//               radius={8}
//               pathOptions={{
//                 color: "var(--color-chart-2)",
//                 fillColor: "var(--color-chart-2)",
//                 fillOpacity: 0.9,
//               }}
//             >
//               <Popup>
//                 <div className="text-sm">
//                   <div className="font-medium">Lokasi Anda</div>
//                   <div>
//                     {userPos.lat.toFixed(6)}, {userPos.lng.toFixed(6)}
//                   </div>
//                 </div>
//               </Popup>
//             </CircleMarker>
//           )}

//           {/* Rute (jika tersedia) */}
//           {route?.coordinates?.length ? (
//             <>
//               <Polyline
//                 positions={route.coordinates}
//                 pathOptions={{
//                   color: "var(--color-primary)",
//                   weight: 5,
//                   opacity: 0.85,
//                 }}
//               />
//               <FitBoundsOnRoute coords={route.coordinates} />
//             </>
//           ) : null}
//         </MapContainer>
//       </div>

//       <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
//         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//           <div className="text-sm text-muted-foreground">
//             {routeLoading && userPos && "Menghitung rute..."}
//             {routeError && "Gagal memuat rute."}
//             {!userPos &&
//               "Aktifkan lokasi untuk menghitung rute dari posisi Anda."}
//             {route && (
//               <>
//                 Perkiraan jarak: {(route.distance / 1000).toFixed(2)} km •
//                 Perkiraan waktu: {Math.round(route.duration / 60)} menit
//               </>
//             )}
//           </div>
//           <div className="text-xs text-muted-foreground">
//             Data peta oleh OpenStreetMap, rute oleh OSRM
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
