'use client';
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { FaVest } from "react-icons/fa";

const stores = [
  { name: "Toko Pak Bayu", category: "Alat Masak", location: "Purwomartani, Kalasan" },
  { name: "Toko Pak Bayu", category: "Alat Masak", location: "Purwomartani, Kalasan" },
  { name: "Toko Pak Bayu", category: "Alat Masak", location: "Purwomartani, Kalasan" },
  { name: "Toko Pak Bayu", category: "Alat Masak", location: "Purwomartani, Kalasan" },
  { name: "Toko Pak Bayu", category: "Alat Masak", location: "Purwomartani, Kalasan" },
];

export default function StoresCarouselSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Kunjungi Toko Umkm</h2>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {stores.map((store, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Link href={"/toko/123"} className="group">
                    <Card className="overflow-hidden h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                      {/* Bagian Gambar */}
                      <div className="relative w-full aspect-[4/3] bg-gray-100">
                        <img
                          src={"https://asset.kompas.com/crops/OK92tO95Kty0YiiTe35Y7aCT9iE=/0x0:780x520/1200x800/data/photo/2019/12/04/5de7435eb2d44.jpg"}
                          alt={`Toko`}
                          // fill
                          className="object-cover"
                        />
                      </div>

                      {/* Bagian Konten */}
                      <div className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          {/* Kiri: Info Toko */}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-primary">{store.name}</h3>
                            <p className="text-sm text-slate-600">{store.category}</p>
                            <p className="text-xs text-slate-400 mt-1">{store.location}</p>
                          </div>
                          {/* Kanan: Jumlah Produk */}
                          <div className="flex flex-col items-center text-center">
                            <div className="flex items-center  text-primary gap-1 mb-1">
                              <FaVest className="h-5 w-5 " />
                              <p className="font-bold">{10}</p>
                            </div>
                            <p className="text-xs text-slate-500">Produk</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}