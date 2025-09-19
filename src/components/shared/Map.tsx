'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import Link from 'next/link';

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const position: [number, number] = [-7.7178025, 110.3544013]; // Koordinat Sleman, DIY

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false} 
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          <b>
            SlemanMart <br/>
            Dinas Koperasi dan UKM Kabupaten Sleman
            <br/><br/>
            WA: +62 823-2279-8318
            <br/> <br/>

            <Link href='https://maps.app.goo.gl/iPNUKPNKLAFKGdyT6' target='_blank'>Arah Menuju Lokasi</Link>
          </b>
        </Popup>
      </Marker>
    </MapContainer>
  );
}