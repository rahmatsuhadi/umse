"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image"; // Tetap gunakan next/image

interface MediaPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: {
    url: string;
    type: 'image' | 'video';
  } | null;
}

export function MediaPreview({ open, onOpenChange, media }: MediaPreviewProps) {
  if (!media) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-5xl w-full h-[90vh] flex flex-col"> {/* Tambahkan h-[90vh] dan flex-col */}
        <DialogHeader>
          <DialogTitle className="sr-only">Media Preview</DialogTitle> {/* Sembunyikan title jika tidak ada teks */}
        </DialogHeader>
        
        {/* Tambahkan div wrapper dengan position: relative dan ukuran yang jelas */}
        <div className="relative flex-1 w-full flex items-center justify-center"> {/* flex-1 agar mengisi ruang yang tersisa */}
          {media.type === 'image' ? (
            <Image
              loading="lazy"
              layout="fill"
              objectFit="contain" // Pastikan gambar tidak terpotong
              src={media.url}
              alt="Media preview"
              className="rounded-lg" // Tambahkan rounded-lg jika ingin pojoknya melengkung
            />
          ) : (
            <video
              src={media.url}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}