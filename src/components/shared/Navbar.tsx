'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Profile', href: '/profile' },
  { name: 'Kontak', href: '/kontak' },
  { name: 'Blog', href: '/blog' },
];

const withSearchBar = ["/"];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm md:px-10  ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* 1. Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary" >
              <img src={"https://slemanmart.web.id/img/slemanmartlogo.png"} height={80} width={80} />
              {/* Sleman<span className="text-sm font-semibold">Store</span> */}
            </Link>
          </div>

          {/* 2. Navigasi & Pencarian untuk Tampilan Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            {/* Kolom Pencarian */}
            {withSearchBar.includes(pathname) && (
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-slate-100 pl-10 border-none focus-visible:ring-primary"
                />
              </div>
            )}
            {/* Tautan Navigasi */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                      ? ' text-primary font-semibold'
                      : 'text-gray-600 '
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>


          </div>

          {/* 3. Tombol Aksi & Ikon (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/50 hover:text-primary">
              <Link href="/daftar">Daftar</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/masuk">Masuk</Link>
            </Button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-6 w-6 text-primary" />
            </button>
          </div>

          {/* 4. Tombol Menu untuk Tampilan Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. Panel Menu Mobile yang Muncul Saat Diklik */}
      {/* {isMenuOpen && ( */}
      {/* <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t"> */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t transform transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col space-y-2 p-4">
          {/* Pencarian di Mobile */}
          {!withSearchBar.includes(pathname) && (
            <div className="relative w-full mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input placeholder="Search..." className="pl-10 rounded-lg bg-slate-100 border-none" />
            </div>
          )}
          {/* Tautan Navigasi di Mobile */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t pt-4 mt-2 space-y-2">
            <Button asChild variant="outline" className="w-full border-primary  hover:border-primary/80 text-primary">
              <Link href="/daftar" onClick={() => setIsMenuOpen(false)}>Daftar</Link>
            </Button>
            <Button asChild className="w-full bg-primary hover:bg-primary/80">
              <Link href="/masuk" onClick={() => setIsMenuOpen(false)}>Masuk</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* )} */}
    </nav>
  );
}


export function Navbar3() {
  return (
    <header className="bg-white shadow-md md:px-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sleman Mart</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/produk" className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center">
              <i className="fas fa-arrow-left mr-1"></i>
              <span className="hidden sm:inline">Kembali ke Produk</span>
              <span className="sm:hidden">Kembali</span>
            </Link>
            <Link href="/" className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center">
              <i className="fas fa-home mr-1"></i>
              <span className="hidden sm:inline">Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}