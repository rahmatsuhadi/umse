'use client';

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  isClosed?: boolean;
};

export default function ProductImageGallery({ images, isClosed }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallback = "/assets/no-image.jpg";
  const displayImages = images.length > 0 ? images : [fallback];
  const mainImg = displayImages[selectedIndex] || fallback;

  return (
    <div className="detail-gallery">
      {/* Gambar Utama */}
      <div className="gallery-main" style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: isClosed ? 'rgba(0,0,0,0.5)' : 'none',
          borderRadius: 'var(--radius-lg)',
          zIndex: 1, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isClosed && (
            <span style={{
              background: 'rgba(0,0,0,0.7)', color: 'white',
              padding: '8px 16px', borderRadius: '20px',
              fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px'
            }}>
              Tutup
            </span>
          )}
        </div>
        <Image
          width={600}
          height={600}
          src={mainImg}
          alt={`Gambar Utama ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
          style={{
            borderRadius: 'var(--radius-lg)',
            filter: isClosed ? 'grayscale(1)' : 'none'
          }}
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
              style={{
                borderRadius: 'calc(var(--radius-sm) - 2px)',
                filter: isClosed ? 'grayscale(1)' : 'none'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
