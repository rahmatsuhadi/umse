'use client';

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  productName: string;
};

export default function ImageGallery({ images, productName }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    // Menggunakan flex-row untuk layout horizontal
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Gambar Utama */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border flex-grow">
        <img
          src={selectedImage} // Ganti dengan path gambar asli
          alt={productName}
          // fill
          className="object-cover"
        />
      </div>
      {/* Thumbnail */}
      <div className="flex md:flex-col gap-3 w-full md:w-24">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square w-full rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
              selectedImage === image ? 'border-primary' : 'border-transparent hover:border-pink-200'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              // fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}