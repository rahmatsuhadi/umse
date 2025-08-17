"use client"
import Image from "next/image";
import Link from "next/link";

export function NavbarDashboard() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-md md:px-10 ">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
           <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary" >
              <Image alt="logo-sleman" src={"/slemanmartlogo.png"} height={80} width={80} />
              {/* Sleman<span className="text-sm font-semibold">Store</span> */}
            </Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/keranjang" className="relative text-primary hover:text-primary-dark transition duration-300">
              <i className="fas fa-shopping-cart text-lg sm:text-xl"></i>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </Link>
            <div className="relative group">
              <button className="flex items-center text-primary hover:text-primary-dark transition duration-300">
                <i className="fas fa-user-circle text-lg sm:text-xl mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline text-sm sm:text-base">Profile</span>
                <i className="fas fa-chevron-down text-xs ml-1"></i>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <Link href="/pesanan" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-box mr-3 text-gray-500"></i><span>Pesanan Saya</span></Link>
                  <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-user mr-3 text-gray-500"></i><span>Edit Profile</span></Link>
                  <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-heart mr-3 text-gray-500"></i><span>Favorit</span></Link>
                  <hr className="my-2" />
                  <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-home mr-3 text-gray-500"></i><span>Beranda</span></Link>
                  <Link href="/masuk" className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50"><i className="fas fa-sign-out-alt mr-3"></i><span>Keluar</span></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}