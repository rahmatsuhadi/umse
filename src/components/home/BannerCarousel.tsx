'use client';

import * as React from "react";
import Autoplay from "embla-carousel-autoplay"; // 1. Impor plugin autoplay
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useBannerArticle } from "@/features/articles/hook";
import Link from "next/link";
import { ImageOff } from "lucide-react";

// Contoh data banner, ganti dengan gambar Anda
// const banners = [
//   { src: "/banner/banner1.jpg", alt: "Banner 1" },
//   { src: "/banner/banner2.jpg", alt: "Banner 2" },
//   { src: "/banner/banner3.jpg", alt: "Banner 3" },
// ];

const EmptyBanner = () => {
  return (
    <Card className="overflow-hidden w-full">
        {/* Gunakan tinggi yang sama persis dengan banner asli untuk konsistensi */}
        <CardContent className="p-0 relative h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px] flex flex-col items-center justify-center bg-slate-50 text-slate-500">
            <ImageOff size={48} className="mb-4" />
            <p className="font-medium">Banner Belum Tersedia</p>
            <p className="text-sm">Silakan cek kembali nanti.</p>
        </CardContent>
    </Card>
  );
}

const BannerSkeleton = () => {
  return (
    <Card className="overflow-hidden w-full">
      <CardContent className="p-0 relative h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px]">
        <div className="w-full h-full bg-slate-200 animate-pulse" />
      </CardContent>
    </Card>
  );
};

export function BannerCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const {data,isPending:isLoading} = useBannerArticle()

  const banners = data?.data || []

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="container mx-auto md:px-14 sm:px-10 px-4">
          <BannerSkeleton />
        </div>
      </section>
    );
  }
  if (banners.length === 0) {
      return (
        <section className="py-6">
          <div className="container mx-auto md:px-14 sm:px-10 px-4">
            <EmptyBanner />
          </div>
        </section>
      );
  }

  return (
    <section className="py-6">
      <div className="container mx-auto md:px-14 sm:px-10 px-4">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {banners.map((banner, index) => {

              const url = banner.category=="literature" ? "literasi" : banner.category=="exhibition" ? "pameran" : "pelatihan"

              return(
              <CarouselItem key={index} className="w-full">
                <Link
                  href={`/${url}/${banner.id}`} 
                  className="block group" 
                >
                <Card className="overflow-hidden w-full">
                  <CardContent className="p-0 relative  h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px]">
                    <Image
                      src={banner?.thumbnail?.media_url || "/assets/no-image.jpg"}
                      alt={"banner-" + (index +1)}
                      fill
                      // loading="lazy"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </CardContent>
                </Card>
                </Link>
              </CarouselItem>
            )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
