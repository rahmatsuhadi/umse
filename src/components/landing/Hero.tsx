import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#FFE6C8] ">
      <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[87vh] min-h-[50vh]">
        {/* Kolom Kiri: Teks */}
        <div className=" flex flex-col justify-center p-8 md:p-16">
          <h1 className="text-4xl md:text-[50pt] font-bold text-slate-900 plus-jakarta-sans">
            Sleman Mart
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Platform Digital <Link className="underline hover:cursor-pointer" href={"/"}>DISKOPUKM Kab. Sleman</Link> untuk Pembinaan UMKM Sleman. Dapatkan layanan terbaik dan nikmati pengalaman belanja online yang menyenangkan.
          </p>
          <div className="mt-8">
            <Button  className="bg-primary rounded-sm px-9 py-7 hover:bg-primary/50">
              Mulai Belanja
            </Button>
          </div>
        </div>

        {/* Kolom Kanan: Gambar */}
        <div className="relative h-64 md:h-auto">
          <Image
            src="/hero.png"
            alt="Workspace"
            layout="fill"
            objectFit="cover"
            className="w-full h-full md:rounded-tl-[200px]"
          />
        </div>
      </div>
    </section>
  );
}