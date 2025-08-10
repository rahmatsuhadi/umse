'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Data untuk Kategori dan Toko
const services = [
    { href: "#", iconClass: "fas fa-shopping-basket", text: "Pasar Sleman" },
    { href: "#", iconClass: "fas fa-store", text: "Direktori UMKM" },
    { href: "#", iconClass: "fas fa-bullhorn", text: "Info Pemasaran" },
    { href: "#", iconClass: "fas fa-graduation-cap", text: "Info Pelatihan" },
    { href: "#", iconClass: "fas fa-book-open", text: "Literasi UMKM" },
];
const umkmPartners = [{ name: "Toko Cemilan Sleman", category: "Makanan & Minuman", location: "Jl. Magelang KM 5", rating: 4.5, productCount: 25 }, { name: "Batik Sleman Asri", category: "Fashion & Aksesoris", location: "Jl. Kaliurang KM 7", rating: 4.8, productCount: 18 }, { name: "Craft Sleman Studio", category: "Kerajinan Tangan", location: "Jl. Seturan Raya", rating: 4.9, productCount: 32 }, { name: "Natural Sleman Care", category: "Kecantikan & Kesehatan", location: "Jl. Palagan Tentara Pelajar", rating: 4.6, productCount: 15 }];
const featuredCategories = [
    { href: "?category=kuliner-siap-saji", iconClass: "fas fa-utensils", text: "Kuliner Siap Saji" },
    { href: "?category=kue-cemilan", iconClass: "fas fa-cookie-bite", text: "Kue dan Cemilan" },
    { href: "?category=jasa-layanan", iconClass: "fas fa-handshake", text: "Jasa Layanan" },
    { href: "?category=fashion-aksesoris", iconClass: "fas fa-tshirt", text: "Fashion dan Aksesoris" },
    { href: "?category=olahan-kemasan-frozen", iconClass: "fas fa-snowflake", text: "Olahan Kemasan" },
    { href: "?category=olahan-kemasan-frozen-2", iconClass: "fas fa-box", text: "Frozen Food" },
];

const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: 'Keripik Tempe Original',
    category: 'Makanan',
    store: 'Toko Cemilan Sleman',
    location: 'Jl. Magelang KM 5, Sleman',
    price: 15000,
    stock: 25,
    rating: 4.5,
}));

const stores = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: 'Toko Cemilan Sleman',
    category: 'Makanan & Minuman',
    location: 'Jl. Magelang KM 5',
    rating: 4.5,
    productCount: 25,
}));

const sortOptions = ["Terpopuler", "Terbaru", "Harga Terendah", "Harga Tertinggi", "Rating Tertinggi", "Nama A-Z"];
const filterCategories = ["Semua Kategori", "Makanan & Minuman", "Fashion & Aksesoris", "Kerajinan Tangan", "Kecantikan & Kesehatan", "Pertanian Organik"];


export default function ProductsPage() {
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [isSortModalOpen, setSortModalOpen] = useState(false);

    // Mencegah scroll body saat modal terbuka
    if (isFilterModalOpen || isSortModalOpen) {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = "hidden";
        }
    } else {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = "auto";
        }
    }

    return (
        <div className="bg-gray-50">
            {/* ===== Header ===== */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                            Produk UMKM Sleman
                        </h1>
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <a href="/cart" className="relative text-primary hover:text-primary-dark transition duration-300">
                                <i className="fas fa-shopping-cart text-lg sm:text-xl"></i>
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                            </a>
                            <div className="relative group">
                                <button className="flex items-center text-primary hover:text-primary-dark transition duration-300">
                                    <i className="fas fa-user-circle text-lg sm:text-xl mr-1 sm:mr-2"></i>
                                    <span className="hidden sm:inline text-sm sm:text-base">Profile</span>
                                    <i className="fas fa-chevron-down text-xs ml-1"></i>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="py-2">
                                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-box mr-3 text-gray-500"></i><span>Pesanan Saya</span></a>
                                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-user mr-3 text-gray-500"></i><span>Edit Profile</span></a>
                                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-heart mr-3 text-gray-500"></i><span>Favorit</span></a>
                                        <hr className="my-2" />
                                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"><i className="fas fa-home mr-3 text-gray-500"></i><span>Beranda</span></a>
                                        <a href="#" className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50"><i className="fas fa-sign-out-alt mr-3"></i><span>Keluar</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== Filter Bar ===== */}
            <section className="py-3 bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <Input type="text" placeholder="Cari produk..." className="w-full pl-10 pr-4 py-2 sm:py-3" />
                        </div>
                        <button onClick={() => setFilterModalOpen(true)} className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50"><i className="fas fa-filter text-gray-600"></i></button>
                        <button onClick={() => setSortModalOpen(true)} className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50"><i className="fas fa-sort-amount-down text-gray-600"></i></button>
                    </div>
                </div>
            </section>

            {/* ===== Services Section ===== */}
            <section className="py-4 sm:py-6 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">Layanan Kami</h2>
                        <p className="text-xs sm:text-sm text-gray-600">Jelajahi berbagai layanan dan fasilitas yang tersedia di Sleman Mart</p>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                        {services.map((service, index) => (
                            <a key={index} href={service.href} className={`${index === 4 ? 'hidden sm:flex' : 'flex'} flex-col items-center p-2 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 group`}>
                                <div className="bg-orange-100 rounded-full w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mb-1 sm:mb-3 group-hover:bg-primary-light transition duration-300">
                                    <i className={`${service.iconClass} text-primary text-sm sm:text-lg lg:text-2xl`}></i>
                                </div>
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight">{service.text}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Categories Section ===== */}
            <section className="py-4 sm:py-6 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-4"><h2 className="text-base sm:text-lg font-bold text-gray-800">Kategori Pilihan</h2></div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        {featuredCategories.map((category, index) => (
                            <a key={index} href={category.href} className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 hover:border-primary transition duration-300 group">
                                <div className="bg-primary rounded-lg w-10 h-8 sm:w-12 sm:h-10 flex items-center justify-center mb-2">
                                    <i className={`${category.iconClass} text-white text-sm sm:text-base`}></i>
                                </div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-800 text-center leading-tight">{category.text}</h3>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Products Grid ===== */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map(product => (
                            <a key={product.id} href={`/products/${product.id}`} className="block h-full">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group h-full flex flex-col">
                                    <div className="bg-gray-300 h-40 md:h-48 flex items-center justify-center relative"><i className="fas fa-image text-gray-500 text-2xl md:text-3xl"></i></div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{product.category}</span>
                                            <div className="flex items-center text-yellow-400"><i className="fas fa-star text-xs"></i><span className="text-gray-600 text-xs ml-1">{product.rating}</span></div>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base group-hover:text-primary">{product.name}</h3>
                                        <p className="text-xs text-gray-600 mb-1">{product.store}</p>
                                        <p className="text-xs text-gray-500 mb-3">{product.location}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div><span className="text-primary font-bold text-sm md:text-lg">Rp {product.price.toLocaleString('id-ID')}</span><p className="text-xs text-gray-500">Stok: {product.stock}</p></div>
                                            <button onClick={(e) => { e.preventDefault(); alert('Tambah ke keranjang!'); }} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition duration-300"><i className="fas fa-shopping-cart text-sm"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Pagination ===== */}
            <div className="flex justify-center my-8">
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"><i className="fas fa-chevron-left"></i></button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>

            {/* ======================================= */}
      {/* BAGIAN YANG DITAMBAHKAN: Toko Partner   */}
      {/* ======================================= */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Toko UMKM Partner Kami</h2>
            <p className="text-gray-600">Bergabunglah dengan ratusan UMKM yang telah mempercayai platform kami</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {umkmPartners.map((store) => (
              <div key={store.name} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-store text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{store.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                <p className="text-xs text-gray-500">{store.location}</p>
                <div className="flex items-center justify-center mt-3">
                  <div className="flex items-center text-yellow-400 mr-2">
                    <i className="fas fa-star text-xs"></i>
                    <span className="text-gray-600 text-xs ml-1">{store.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{store.productCount} Produk</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/directory" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300">
              <i className="fas fa-building mr-2"></i>Lihat Semua Toko UMKM
            </a>
          </div>
        </div>
      </section>

            <Footer />

            {/* ... (Footer dan seksi lain bisa ditambahkan di sini) ... */}

            {/* Filter Modal */}
            <Dialog open={isFilterModalOpen} onOpenChange={setFilterModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filter Produk</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label className="block text-sm font-medium mb-2">Kategori</Label>
                            <div className="space-y-2">
                                {filterCategories.map(cat => (
                                    <div key={cat} className="flex items-center">
                                        <Checkbox id={`filter-${cat}`} />
                                        <Label htmlFor={`filter-${cat}`} className="ml-2 text-sm font-normal">{cat}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium mb-2">Rentang Harga</Label>
                            <div className="flex items-center space-x-2">
                                <Input type="number" placeholder="Min" />
                                <span>-</span>
                                <Input type="number" placeholder="Max" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost">Reset</Button>
                        <Button onClick={() => setFilterModalOpen(false)}>Terapkan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sort Modal */}
            <Dialog open={isSortModalOpen} onOpenChange={setSortModalOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Urutkan Produk</DialogTitle>
                    </DialogHeader>
                    <RadioGroup defaultValue="popular" className="py-4 space-y-2">
                        {sortOptions.map(opt => (
                            <div key={opt} className="flex items-center space-x-3">
                                <RadioGroupItem value={opt.toLowerCase().replace(' ', '-')} id={`sort-${opt}`} />
                                <Label htmlFor={`sort-${opt}`} className="font-normal">{opt}</Label>
                            </div>
                        ))} 
                    </RadioGroup>
                    <DialogFooter>
                        <Button className="w-full" onClick={() => setSortModalOpen(false)}>Terapkan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}