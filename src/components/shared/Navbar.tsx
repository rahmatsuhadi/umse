'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, User2 } from 'lucide-react';
import Image from 'next/image';
import { useLogout, useUser } from '@/features/auth/hooks';
import { getToken } from '@/lib/token-service';
import { User } from '@/types';
import { Skeleton } from '../ui/skeleton';
import { useCart } from '@/features/cart/hooks';

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Profile', href: '/profile' },
  { name: 'Kontak', href: '#' },
  { name: 'Blog', href: '#' },
];

export function Navbar({ withMenu = true }: { withMenu?: boolean }) {

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    const withAuth = !!getToken();
    setIsAuth(withAuth);
    setIsLoading(false)
  }, [])




  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm md:px-10">
      <>
        {!isLoading && (
          <>
            {isAuth ? (
              <NavbarAuth withMenu={withMenu} />
            ) : (
              <NavbarNotAuth withMenu={withMenu} />
            )}
          </>
        )}
      </>
    </nav>
  );
}

// Profile Dropdown Component
function ProfileDropDown({ user }: { user?: User, isLoading?: boolean }) {
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

  const {mutate: logout} = useLogout()

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center  hover:cursor-pointer text-primary hover:text-primary-dark transition duration-300"
      >
        <User2 className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
        {user ? (
          <span className="hidden sm:inline text-sm sm:text-base">{user.name || 'Profile'}</span>
        ) : (
          <Skeleton className="h-5 w-20" />
        )}
        <i className="fas fa-chevron-down text-xs ml-1"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <i className="fas fa-home mr-3 text-gray-500"></i>
              <span>Beranda</span>
            </Link>
            <Link href="/pengguna" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <i className="fas fa-user mr-3 text-gray-500"></i>
              <span>Profile</span>
            </Link>

            <Link href="/pesanan" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <i className="fas fa-box mr-3 text-gray-500"></i>
              <span>Pesanan Saya</span>
            </Link>
            <Link href="/laporan" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <i className="fas fa-exclamation-triangle mr-3 text-gray-500"></i>
              <span>Laporan Masalah</span>
            </Link>

            <hr className="my-2" />
            <button type='button' onClick={() =>logout()} className="flex items-center h-full hover:cursor-pointer w-full px-4 py-2 text-red-600 hover:bg-red-50">
              <i className="fas fa-sign-out-alt mr-3"></i>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



function NavbarAuth({ withMenu = true }: { withMenu?: boolean }) {
  const { data: user, isLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const {data} = useCart();

  const cartCount = data?.data.items_count || 0

  return (

    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
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
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-[#36454F]'} `}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Auth Desktop - Show only after loading */}

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/keranjang" className="relative text-primary hover:text-primary-dark transition duration-300">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            </Link>

            
              <ProfileDropDown user={user?.data} isLoading={isLoading} />
        
          </div>

        </div>

        {/* Mobile Button */}
        {!user && (
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        )}

        {/* Mobile Profile Dropdown (auth) */}
        {user && (
          <div className="md:hidden">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/keranjang" className="relative text-primary hover:text-primary-dark transition duration-300">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
              </Link>

                <ProfileDropDown user={user?.data} isLoading={isLoading} />
 
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

function NavbarNotAuth({ withMenu = true }: { withMenu?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
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
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-[#36454F]'} `}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}

            

            {/* Auth Desktop - Show only after loading */}

            <div className="hidden md:flex items-center gap-3">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/50 hover:text-primary">
                <Link href="/daftar">Daftar</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/masuk">Masuk</Link>
              </Button>
            </div>

          </div>

          <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>




        </div>
      </div>

      {/* Mobile Menu Panel */}

      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t transform transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'} `}
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
    </>

  )
}