"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";

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
      <DialogContent 
        className="max-w-lg bg-white border border-[var(--cream-dark)] p-6 shadow-xl flex flex-col gap-4" 
        style={{ 
          borderRadius: "var(--radius-lg)",
          padding: "28px"
        }}
      >
        <DialogHeader className="border-b border-[var(--cream-dark)] pb-3">
          <DialogTitle className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <i className="fas fa-image text-[var(--terracotta)]"></i> Pratinjau Media
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--text-muted)] mt-1 font-medium">
            Tampilan detail foto atau video bukti transaksi Anda.
          </DialogDescription>
        </DialogHeader>
        
        {/* Media Container */}
        <div className="relative w-full aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--cream-dark)] bg-[var(--cream)] shadow-inner flex items-center justify-center min-h-[300px]">
          {media.type === 'image' ? (
            <Image
              loading="lazy"
              layout="fill"
              objectFit="contain"
              src={media.url}
              alt="Media preview"
            />
          ) : (
            <video
              src={media.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[var(--cream-dark)] pt-3.5">
          <DialogClose asChild>
            <button type="button" className="btn btn-secondary btn-sm">
              <i className="fas fa-times mr-1.5"></i> Tutup
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}