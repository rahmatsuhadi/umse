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

// Contoh data banner, ganti dengan gambar Anda
const banners = [
  { src: "/banner/banner1.jpg", alt: "Banner 1" },
  { src: "/banner/banner2.jpg", alt: "Banner 2" },
  { src: "/banner/banner3.jpg", alt: "Banner 3" },
];

export function BannerCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

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
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden">
                  <CardContent className="relative w-full">
                    <div className="w-full h-0 pb-[30.5%] relative"> {/* Aspect ratio container */}
                      <Image
                        src={banner.src} 
                        alt={banner.alt}
                        layout="fill"  // Mengisi seluruh kontainer
                        objectFit="cover" // Pastikan gambar memenuhi kontainer dengan aspect ratio yang benar
                        priority={index === 0} // Prioritaskan gambar pertama untuk LCP
                        className="absolute inset-0 object-cover" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
