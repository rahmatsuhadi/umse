"use client"
import { MapPin } from 'lucide-react';
import { FaGlobe, FaInstagram, FaWhatsapp } from "react-icons/fa";
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Link from 'next/link';


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
            <p className="text-2xl font-bold text-white">Sleman Mart</p>
            <p className="mt-2 text-white">Dinas Koperasi dan UKM Kabupaten Sleman</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#D22F27] mt-1 flex-shrink-0" />
                <p className="ml-4 text-white/60 hover:underline"> Jl. Parasamya No.6, Beran, Tridadi, Sleman</p>
              </div>
              <div className="flex items-center">
                <FaWhatsapp className="w-5 h-5 text-[#35BC35]" />
                <Link className='hover:underline' target='_blank' href={"https://wa.me/6282322798318?text=Salam%20SlemanMart"}>
                <p className="ml-4 text-white/60 hover:underline">+62 823 2279 8318</p>
                </Link>
              </div>
              <div className="flex items-center">
                <FaInstagram className="w-5 h-5 text-[#FA4D4D]" />
                <Link className='hover:underline' href={"https://wa.me/6282322798318?text=Salam%20SlemanMart"} target='_blank'>
                <p className="ml-4 text-white/60 hover:underline"> @dinkopukmsleman</p>
                </Link>
              </div>
              <div className="flex items-center">
                <FaGlobe  className="w-5 h-5 text-[#0D6EFD]" />
                <Link className='hover:underline' href={"https://dinkopukm.slemankab.go.id/"} target='_blank'>
                <p className="ml-4 text-white/60 hover:underline">dinkopukm.slemankab.go.id</p>
                </Link>
              </div>
            </div>
          </div>
          {/* Peta */}
          <div className="w-full h-80 rounded-lg relative">
            <MapWithNoSSR />
          </div>
        </div>
      </div>
    </footer>
  );
}