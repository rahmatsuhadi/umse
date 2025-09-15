'use client';

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductImageGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0); // simpan index

  return (
    <div className="flex flex-col gap-4">

      {/* Gambar Utama */}
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center p-2">
        <Image
          width={500}
          height={500} 
          src={images[selectedIndex]} 
          alt={`Gambar Utama ${selectedIndex + 1}`} 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Grid thumbnail */}
      <div className="grid grid-cols-4 gap-4">
        {images.slice(0, 4).map((url, index) => (
          <div 
            key={index} 
            className={`w-full h-20 md:h-24 bg-gray-200 rounded-lg flex items-center justify-center p-1 cursor-pointer transition-all duration-200 ease-in-out 
              ${selectedIndex === index ? 'border-4 border-primary' : 'border-0'}`}
            onClick={() => setSelectedIndex(index)} // set index yang dipilih
          >
            <Image
              width={500}
              height={500} 
              src={url} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-contain rounded"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
