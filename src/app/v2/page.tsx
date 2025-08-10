'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Data untuk navigasi dan kategori
const navLinks = [
  { href: "#", iconClass: "fas fa-building", text: "Direktori UMKM" },
  { href: "#", iconClass: "fas fa-calendar-alt", text: "Info Pameran" },
  { href: "#", iconClass: "fas fa-graduation-cap", text: "Info Pelatihan" },
  { href: "#", iconClass: "fas fa-book", text: "Literasi UMKM" },
];

const announcements = [
  { date: "9 Agustus 2025", tag: "Penting", tagColor: "red", title: "Pemeliharaan Sistem", content: "Sistem akan mengalami pemeliharaan pada tanggal 15 Agustus 2025 pukul 00:00 - 04:00 WIB. Mohon maaf atas ketidaknyamanannya." },
  { date: "8 Agustus 2025", tag: "Info", tagColor: "green", title: "Program Pelatihan Digital UMKM", content: "Daftar sekarang untuk mengikuti pelatihan digital marketing gratis untuk UMKM Sleman periode September 2025." },
];

const categories = [
    { 
        name: "Makanan & Minuman", 
        iconClass: "fas fa-utensils", 
        href: "/products?category=makanan",
        bgClass: "bg-red-100 group-hover:bg-red-200",
        textClass: "text-red-600"
    },
    { 
        name: "Fashion & Aksesoris", 
        iconClass: "fas fa-tshirt", 
        href: "/products?category=fashion",
        bgClass: "bg-purple-100 group-hover:bg-purple-200",
        textClass: "text-purple-600"
    },
    { 
        name: "Kerajinan Tangan", 
        iconClass: "fas fa-hammer", 
        href: "/products?category=kerajinan",
        bgClass: "bg-green-100 group-hover:bg-green-200",
        textClass: "text-green-600"
    },
    { 
        name: "Kecantikan & Kesehatan", 
        iconClass: "fas fa-spa", 
        href: "/products?category=kecantikan",
        bgClass: "bg-pink-100 group-hover:bg-pink-200",
        textClass: "text-pink-600"
    },
    { 
        name: "Pertanian Organik", 
        iconClass: "fas fa-seedling", 
        href: "/products?category=pertanian",
        bgClass: "bg-yellow-100 group-hover:bg-yellow-200",
        textClass: "text-yellow-600"
    },
    { 
        name: "Semua Kategori", 
        iconClass: "fas fa-th-large", 
        href: "/products",
        bgClass: "bg-blue-100 group-hover:bg-blue-200",
        textClass: "text-blue-600"
    },
];


export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* ===== Top Bar ===== */}
      <div className="bg-gray-100 py-3 text-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600"><i className="fas fa-phone mr-1"></i>Hotline: (0274) 123-4567</span>
            <span className="text-gray-600"><i className="fas fa-envelope mr-1"></i>info@slemanmart.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden md:block">Dinas Koperasi dan UKM Kabupaten Sleman</span>
            <div className="flex space-x-2">
              <Link href="#" className="text-gray-600 hover:text-primary"><i className="fab fa-facebook"></i></Link>
              <Link href="#" className="text-gray-600 hover:text-primary"><i className="fab fa-instagram"></i></Link>
              <Link href="#" className="text-gray-600 hover:text-primary"><i className="fab fa-whatsapp"></i></Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Navigation ===== */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0U1N0YzOSIvPgo8cGF0aCBkPSJNMTIgMThIMjhWMjJIMTJWMThaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMjRIMjRWMjhIMTJWMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTJIMzJWMTZIMTJWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Sleman Mart" width={40} height={40} className="mr-4" />
              <div>
                <div className="text-xl font-bold text-gray-800">Pasar Sleman</div>
                <div className="text-sm text-gray-600">Platform Digital DISKOPUKM</div>
              </div>
            </div>

            <div className="hidden lg:flex items-baseline space-x-6">
              {navLinks.map(link => (
                <Link key={link.text} href={link.href} className="flex items-center text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary transition duration-300">
                  <i className={`${link.iconClass} mr-1`}></i>{link.text}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/v2/cart" className="relative text-gray-500 hover:text-primary">
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Link>
              <Link href="/v2/masuk" className="hidden sm:block bg-white text-primary border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition duration-300 font-medium">Masuk</Link>
              <Link href="/v2/daftar" className="hidden sm:block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition duration-300 font-medium">Daftar</Link>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-primary p-2">
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
              {navLinks.map(link => (
                <Link key={link.text} href={link.href} className="flex items-center block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <i className={`${link.iconClass} mr-2`}></i>{link.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ===== Shopping Header Section ===== */}
      <section className="bg-gradient-to-r from-orange-50 to-white py-8 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex-1 max-w-2xl w-full">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk UMKM Sleman..."
                className="flex-1 px-6 py-3 text-base border-2 border-gray-300 rounded-l-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-r-full hover:bg-primary-dark transition duration-300 font-semibold">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Produk</div>
              <div className="text-xl font-bold text-primary">1,250+</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">UMKM Terdaftar</div>
              <div className="text-xl font-bold text-primary">340+</div>
            </div>
            <a
              href="products.html"
              className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition duration-300"
            >
              <i className="fas fa-th-large mr-2"></i>Semua Produk
            </a>
          </div>
        </div>
      </section>

      {/* ===== Announcement Section ===== */}
      <section className="py-6 bg-blue-50 border-b">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <i className="fas fa-bullhorn text-blue-600 text-xl mr-3"></i>
              <h2 className="text-lg font-bold text-blue-800">Pengumuman Terkini</h2>
            </div>
            <div className="space-y-3">
              {announcements.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{item.date}</span>
                    <span className={`bg-${item.tagColor}-100 text-${item.tagColor}-800 text-xs px-2 py-1 rounded-full`}>{item.tag}</span>
                  </div>
                  <p className="text-gray-800 font-medium mb-1">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Quick Categories Section (JSX DIUBAH) ===== */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Kategori Produk</h2>
            <Link href="/v2/products" className="flex items-center text-primary hover:text-primary-dark text-sm font-medium">
              Lihat Semua <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link key={index} href={cat.href} className="text-center group hover:scale-105 transition duration-300 p-4 rounded-lg hover:bg-gray-50">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${cat.bgClass}`}>
                  <i className={`${cat.iconClass} ${cat.textClass} text-xl`}></i>
                </div>
                <h3 className="font-medium text-gray-800 text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ===== Footer ===== */}
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
              <Link href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook text-lg"></i></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram text-lg"></i></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><i className="fab fa-whatsapp text-lg"></i></Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}