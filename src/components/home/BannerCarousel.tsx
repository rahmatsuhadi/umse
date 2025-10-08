"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useBannerArticle } from "@/features/articles/hook";

const EmptyBanner = () => (
  <Card className="overflow-hidden w-full rounded-2xl shadow-sm">
    <CardContent className="p-0 relative h-[180px] sm:h-[200px] lg:h-[240px] flex flex-col items-center justify-center bg-slate-50 text-slate-500">
      <ImageOff size={48} className="mb-4" />
      <p className="font-medium">Banner Belum Tersedia</p>
      <p className="text-sm">Silakan cek kembali nanti.</p>
    </CardContent>
  </Card>
);

const BannerSkeleton = () => (
  <Card className="overflow-hidden w-full rounded-2xl">
    <CardContent className="p-0 relative h-[180px] sm:h-[200px] lg:h-[240px] bg-slate-200 animate-pulse" />
  </Card>
);

export function BannerCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const { data, isPending: isLoading } = useBannerArticle();
  const banners = data?.data || [];

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

  const categoryMap = {
    literature: { url: "literasi", name: "Literasi" },
    training: { url: "pelatihan", name: "Pelatihan" },
    exhibition: { url: "pameran", name: "Pameran" },
    announcement: { url: "pengumuman", name: "Pengumuman" },
    default: { url: "artikel", name: "Artikel" },
  };

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
              const categoryInfo =
                categoryMap[banner.category] || categoryMap.default;

              return (
                <CarouselItem key={index} className="w-full">
                  <Link
                    href={`/${categoryInfo.url}/${banner.id}`}
                    className="block group"
                  >
                    <Card className="overflow-hidden w-full rounded-2xl shadow-md">
                      <CardContent className="p-0 relative h-[200px] sm:h-[200px] md:h-[290px] lg:h-[340px]">
                        <Image
                          src={
                            banner?.thumbnail?.media_url ||
                            "/assets/no-image.jpg"
                          }
                          alt={banner.title || "Banner Image"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                          priority={index === 0}
                        />

                        {/* Overlay bawah */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end
                                        opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out"
                        >
                          <h2 className="text-white text-lg md:text-xl lg:text-2xl font-bold line-clamp-2">
                            {banner.title}
                          </h2>
                          <p className="text-white/80 text-sm mt-2 line-clamp-2">
                            {banner.excerpt}
                          </p>
                        </div>

                        {/* Overlay hover */}
                        <div
                          className="absolute inset-0 bg-black/60 flex items-center justify-center
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                        >
                          <div className="text-center text-white p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 ease-in-out">
                            <p className="text-xs md:text-sm font-semibold uppercase tracking-widest mb-1">
                              {categoryInfo.name}
                            </p>
                            <h2 className="text-xl md:text-3xl font-bold line-clamp-2">
                              {banner.title}
                            </h2>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
