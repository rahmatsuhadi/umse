"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

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
      <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-5xl w-full">
        <DialogHeader>
            <DialogTitle><></></DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center">
          {media.type === 'image' ? (
            <img
              src={media.url}
              alt="Media preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          ) : (
            <video
              src={media.url}
              controls
              autoPlay
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}