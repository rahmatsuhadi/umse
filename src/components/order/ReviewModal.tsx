import React, { useEffect, useState } from "react";
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
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { useAddReview } from "@/features/reviews/hooks";

type Props = {
  open: boolean;
  items: CartItem[]
  orderId: string;
  onClose: () => void;
};

export function ReviewModalOrder({ open, onClose, items, orderId }: Props) {


  const [selectedItem, setSelectedItem] = useState<CartItem | null>(
    items.length > 0 ? items[0] : null
  );
  
  useEffect(() =>{
    setSelectedItem(items.length > 0 ? items[0] : null)
  },[items])

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewMedia, setCurrentPreviewMedia] = useState<{
    url: string;
    type: string;
  } | null>(null);


  const { mutateAsync ,isPending} = useAddReview(orderId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // Mengizinkan lebih dari 1 file, batasi hingga 5 seperti sebelumnya
    const newFiles = Array.from(e.target.files).slice(0, 5 - files.length); // Tambahkan hingga max 5
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleOpenPreview = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith("image") ? "image" : "video";
    setCurrentPreviewMedia({ url: fileUrl, type: fileType });
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    if (currentPreviewMedia) {
      URL.revokeObjectURL(currentPreviewMedia.url); // Bersihkan URL objek
    }
    setCurrentPreviewMedia(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      console.error("No item selected for review.");
      return;
    }
    await mutateAsync({
      rating: rating,
      content: comment,
      media: files,
      order_item_id: selectedItem.id
    })
    // reset form
    setRating(0);
    setComment("");
    setFiles([]);
    setSelectedItem(items.length > 0 ? items[0] : null); // Reset selected item
    onClose();
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Beri Ulasan</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="reviewProduct" className="block mb-2 text-sm">
                Pilih Produk
              </Label>
              <select
                id="reviewProduct"
                className="w-full border rounded-md p-2 text-sm"
                value={selectedItem?.id || ""}
                onChange={(e) => {
                  const selected = items.find((item) => item.id === e.target.value);
                  setSelectedItem(selected || null);
                }}
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.variant ? item.variant.name : item.product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <Label className="block mb-2 text-sm">Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={cn(
                      "fas fa-star text-xl cursor-pointer transition",
                      (hover ?? rating) >= star ? "text-yellow-400" : "text-gray-300"
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
              {
                files.length == 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <label htmlFor="reviewMedia" className="cursor-pointer block">
                      <input
                        type="file"
                        id="reviewMedia"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <i className="fas fa-camera text-2xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600">
                        Klik untuk upload foto/video
                      </p>
                      <p className="text-xs text-gray-500">
                        Max 5 file, 10MB per file
                      </p>
                    </label>
                  </div>
                )

              }
              <div className="flex items-center space-x-2">
                {/* Tampilan pratinjau media yang sudah diunggah */}
                {files.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-full aspect-square rounded-md overflow-hidden border border-gray-200"
                      >
                        {file.type.startsWith("image") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${file.name}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handleOpenPreview(file)}
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handleOpenPreview(file)}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none"
                          aria-label={`Hapus ${file.name}`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    {files.length < 5 && (
                      <label
                        htmlFor="reviewMedia"
                        className={cn(
                          "flex-shrink-0  border-2 border-dashed border-gray-300 rounded-md",
                          "flex items-center justify-center cursor-pointer transition-colors hover:border-blue-500"
                        )}
                      >
                        <Plus className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          id="reviewMedia"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
                {/* Tombol Tambah File */}



              </div>
              <p className="mt-2 text-xs text-gray-500">Max 5 file</p>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Batal
                </Button>
              </DialogClose>
              <Button  type="submit" className="w-full sm:w-auto" disabled={!selectedItem || isPending}>
                {isPending ? "Mengirim ulasan....": "Kirim Ulasan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Pratinjau Gambar/Video */}
      <Dialog open={previewModalOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-3xl flex-col w-full h-auto max-h-[90vh] flex items-center justify-center p-0">
          <DialogHeader>
            <DialogTitle>Lihat Media</DialogTitle>
          </DialogHeader>
          {currentPreviewMedia && currentPreviewMedia.type === "image" && (
            <img
              src={currentPreviewMedia.url}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          )}
          {currentPreviewMedia && currentPreviewMedia.type === "video" && (
            <video
              src={currentPreviewMedia.url}
              controls
              className="max-w-full max-h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

