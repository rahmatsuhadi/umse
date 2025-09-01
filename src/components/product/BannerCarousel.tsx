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
              <CarouselItem key={index} className="w-full">
                <Card className="overflow-hidden w-full">
                  <CardContent className="p-0 relative  h-[150px] sm:h-[200px] md:h-[300px] lg:h-[400px]">
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
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
