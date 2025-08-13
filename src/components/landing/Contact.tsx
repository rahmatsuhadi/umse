"use client"
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaGlobe, FaInstagram, FaWhatsapp } from "react-icons/fa";
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';


export default function ContactSection() {


  const MapWithNoSSR = useMemo(() => dynamic(
    () => import('@/components/shared/Map'),
    { ssr: false }
  ), []);


  return (
    <footer className="py-12 md:py-20 bg-[#1f2937]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center md:px-32">
          {/* Info Kontak */}
          <div className=''>
            <h2 className="text-2xl font-bold text-white">Sleman Mart</h2>
            <p className="mt-2 text-white">Dinas Koperasi dan UKM Kabupaten Sleman</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#D22F27] mt-1 flex-shrink-0" />
                <p className="ml-4 text-white/60">Jl. Parasamya No.1, Beran, Tridadi, Sleman</p>
              </div>
              <div className="flex items-center">
                <FaWhatsapp className="w-5 h-5 text-[#35BC35]" />
                <p className="ml-4 text-white/60">+62 822-2219-XXXX</p>
              </div>
              <div className="flex items-center">
                <FaInstagram className="w-5 h-5 text-[#FA4D4D]" />
                <p className="ml-4 text-white/60">@dinkopukmsleman</p>
              </div>
              <div className="flex items-center">
                <FaGlobe  className="w-5 h-5 text-[#0D6EFD]" />
                <p className="ml-4 text-white/60">diskopukm.slemankab.go.id</p>
              </div>
            </div>
          </div>
          {/* Peta */}
          <div className="w-full h-80 rounded-lg overflow-hidden">
            <MapWithNoSSR />
          </div>
        </div>
      </div>
    </footer>
  );
}