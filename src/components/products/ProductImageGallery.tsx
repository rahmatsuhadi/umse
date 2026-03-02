'use client';

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductImageGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallback = "/assets/no-image.jpg";
  const displayImages = images.length > 0 ? images : [fallback];
  const mainImg = displayImages[selectedIndex] || fallback;

  return (
    <div className="detail-gallery">
      {/* Gambar Utama */}
      <div className="gallery-main">
        <Image
          width={600}
          height={600}
          src={mainImg}
          alt={`Gambar Utama ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
          style={{ borderRadius: 'var(--radius-lg)' }}
        />
      </div>

      {/* Thumbnails */}
      <div className="gallery-thumbs">
        {displayImages.slice(0, 4).map((url, index) => (
          <div
            key={index}
            className={`gallery-thumb${selectedIndex === index ? ' active' : ''}`}
            style={{ overflow: 'hidden', padding: 0 }}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              width={120}
              height={120}
              src={url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ borderRadius: 'calc(var(--radius-sm) - 2px)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
