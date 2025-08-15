'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Profile', href: '/profile' },
  { name: 'Kontak', href: '#' },
  { name: 'Blog', href: '#' },
];

const withSearchBar = ["/"];

export function Navbar({ isAuth = false, withMenu = true }: { isAuth?: boolean, withMenu?: boolean }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm md:px-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/slemanmartlogo.png"
                alt="Slemanmart Logo"
                width={80}
                height={80}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            {withMenu && (
              <div className="flex items-center space-x-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-[#36454F]'
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Auth Desktop */}
            {isAuth ? (
              <ProfileDropDown />
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/50 hover:text-primary">
                  <Link href="/daftar">Daftar</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/masuk">Masuk</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          {!isAuth && (
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}

          {/* Mobile Profile Dropdown (auth) */}
          {isAuth && (
            <div className="md:hidden">
              <ProfileDropDown />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {!isAuth && (
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t transform transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
            }`}
        >
          <div className="flex flex-col space-y-2 p-4">
            {withMenu &&
              navLinks.map((link) => (
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
              <Button asChild variant="outline" className="w-full border-primary hover:border-primary/80 text-primary">
                <Link href="/daftar" onClick={() => setIsMenuOpen(false)}>Daftar</Link>
              </Button>
              <Button asChild className="w-full bg-primary hover:bg-primary/80">
                <Link href="/masuk" onClick={() => setIsMenuOpen(false)}>Masuk</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Profile Dropdown Component
function ProfileDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <Link href="/keranjang" className="relative text-primary hover:text-primary-dark transition duration-300">
        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-primary hover:text-primary-dark transition duration-300"
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
          <span className="hidden sm:inline text-sm sm:text-base">Profile</span>
          <i className="fas fa-chevron-down text-xs ml-1"></i>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-2">
              <Link href="/pesanan" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i className="fas fa-box mr-3 text-gray-500"></i>
                <span>Pesanan Saya</span>
              </Link>
              <Link href="/pengguna/edit" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i className="fas fa-user mr-3 text-gray-500"></i>
                <span>Edit Profile</span>
              </Link>
              <hr className="my-2" />
              <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i className="fas fa-home mr-3 text-gray-500"></i>
                <span>Beranda</span>
              </Link>
              <Link href="/masuk" className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50">
                <i className="fas fa-sign-out-alt mr-3"></i>
                <span>Keluar</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Navbar3() {
  return (
    <header className="bg-white shadow-md md:px-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sleman Mart</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center">
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