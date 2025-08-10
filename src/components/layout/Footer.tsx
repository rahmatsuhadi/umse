import Link from 'next/link';
import { Facebook, Instagram, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-sm font-bold mb-4">Tentang Kami</h3>
          <p className="text-gray-400 text-sm">Sleman Mart adalah platform digital untuk mendukung UMKM di Kabupaten Sleman.</p>
        </div>
        <div>
          <h3 className="text-sm font-bold mb-4">Kontak</h3>
          <p className="text-gray-400 text-sm">Hotline: (0274) 123-4567</p>
          <p className="text-gray-400 text-sm">Email: info@slemanmart.com</p>
        </div>
        <div>
          <h3 className="text-sm font-bold mb-4">Ikuti Kami</h3>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></Link>
            <Link href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></Link>
            <Link href="#" className="text-gray-400 hover:text-white"><MessageSquare size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}