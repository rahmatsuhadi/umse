"use client"
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import EmblaCarouselFade from "embla-carousel-fade"; // <-- Impor plugin fade
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({delay: 3000}), EmblaCarouselFade({active: true})])


  // Array of images to display in the slider
  const sliderImages = [
    { src: "/hero/images1.jpg", alt: "Workspace" },
    { src: "/hero/images2.jpg", alt: "Produk UMKM" }, // Ganti dengan gambar Anda
    { src: "/hero/images3.jpg", alt: "Layanan Digital" }, // Ganti dengan gambar Anda
  ];


  return (
    <section className="bg-[#FFE6C8] ">
      <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[87vh] min-h-[50vh]">
        {/* Kolom Kiri: Teks */}
        <div className=" flex flex-col justify-center p-8 md:p-16">
          <h1 className="text-4xl md:text-[50pt] font-bold text-slate-900 ">
            Sleman Mart
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Platform Digital <Link className="underline hover:cursor-pointer" href={"/"}>DISKOPUKM Kab. Sleman</Link> untuk Pembinaan UMKM Sleman. Dapatkan layanan terbaik dan nikmati pengalaman belanja online yang menyenangkan.
          </p>
          <div className="mt-8">
            <Link href={"/"}>
              <Button type="button" className="bg-primary rounded-sm px-9 py-7 hover:cursor-pointer hover:bg-primary/50">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Gambar */}
        {/* <div className="relative h-64 md:h-auto  md:rounded-tl-[200px] overflow-hidden">
          <Image
            src="/hero.png"
            alt="Workspace"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div> */}

        <div className="embla relative h-64 md:h-auto  md:rounded-tl-[200px] overflow-hidden" ref={emblaRef}>
          <div className="embla__container">
            {sliderImages.map((item, i) => (
              <div className="embla__slide relative w-full h-64 md:h-full md:min-h-[87vh]" key={i}>

                <Image

                  src={item.src}
                  alt={item.alt}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}