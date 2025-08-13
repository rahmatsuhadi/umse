'use client';

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
};

export default function ImageGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">

      {/* Gambar Utama */}
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center p-2">
        <img 
          src={selectedImage} 
          alt="Gambar Utama" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Grid thumbnail */}
      <div className="grid grid-cols-4 gap-4">
        {images.slice(0, 4).map((url, index) => (
          <div 
            key={index} 
            className={`w-full h-20 md:h-24 bg-gray-200 rounded-lg flex items-center justify-center p-1 cursor-pointer transition-all duration-200 ease-in-out 
              ${selectedImage === url ? 'border-4 border-primary' : 'border-0'}`}
            onClick={() => setSelectedImage(url)} // Mengganti gambar utama ketika thumbnail diklik
          >
            <img 
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
