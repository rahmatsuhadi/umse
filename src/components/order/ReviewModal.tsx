import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string; files: File[] }) => void;
};

export default function ReviewModal({ open, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).slice(0, 5);
    setFiles(selectedFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment, files });
    // reset form
    setRating(0);
    setComment("");
    setFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Beri Ulasan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block mb-2 text-sm">Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={cn(
                    "fas fa-star text-xl cursor-pointer transition",
                    (hover ?? rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  )}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="reviewComment" className="mb-2 text-sm block">
              Komentar
            </Label>
            <Textarea
              id="reviewComment"
              rows={4}
              placeholder="Bagikan pengalaman Anda tentang produk ini..."
              className="text-sm"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="reviewMedia" className="block mb-2 text-sm">
              Foto/Video (Opsional)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="reviewMedia"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="reviewMedia" className="cursor-pointer block">
                <i className="fas fa-camera text-2xl text-gray-400 mb-2"></i>
                <p className="text-sm text-gray-600">
                  Klik untuk upload foto/video
                </p>
                <p className="text-xs text-gray-500">
                  Max 5 file, 10MB per file
                </p>
              </label>
              {files.length > 0 && (
                <ul className="mt-2 text-xs text-gray-700 text-left list-disc list-inside">
                  {files.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-auto">
              Kirim Ulasan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
