import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

import { MediaPreview } from '@/components/shared/MediaPreview'; // Gunakan modal preview yang sudah ada
import { Plus, Camera, X } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/types";
import { useAddReview } from "@/features/reviews/hooks";
import { toast } from 'sonner';

type ReviewModalOrderProps = {
    open: boolean;
    onClose: () => void;
    orderId: string;
    item: CartItem;
};

export function ReviewModalOrder({ open, onClose, orderId, item }: ReviewModalOrderProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const { mutateAsync, isPending } = useAddReview(orderId);

    // Efek untuk mereset form setiap kali modal dibuka
    useEffect(() => {
        if (open) {
            setRating(0);
            setComment("");
            setFiles([]);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating < 1) {
            toast.error("Harap berikan rating bintang untuk produk ini.")
            return;
        }
        await mutateAsync({
            rating,
            content: comment,
            media: files,
            order_item_id: item.id,
        });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Beri Ulasan untuk "{item.product.name}"</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="pt-4 space-y-4">
                    <StarRatingInput rating={rating} onRatingChange={setRating} disabled={isPending} />

                    <div>
                        <Label htmlFor="reviewComment" className="mb-2 text-sm block">Komentar</Label>
                        <Textarea
                            id="reviewComment"
                            rows={4}
                            placeholder="Bagikan pengalaman Anda tentang produk ini..."
                            className="text-sm"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    <MediaUploader
                        files={files}
                        onFilesChange={setFiles}
                        maxFiles={4}
                        maxSizeMB={5}
                        disabled={isPending}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending || rating < 1}>
                            {isPending ? "Mengirim..." : "Kirim Ulasan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

type MediaUploaderProps = {
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    disabled?: boolean;
};

export function MediaUploader({
    files,
    onFilesChange,
    maxFiles = 4,
    maxSizeMB = 5,
    disabled = false,
}: MediaUploaderProps) {
    const [fileError, setFileError] = useState<string>("");
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [currentPreviewMedia, setCurrentPreviewMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setFileError(""); // Reset error setiap kali ada file baru
        const selectedFiles = Array.from(e.target.files).slice(0, maxFiles - files.length);

        const largeFiles = selectedFiles.filter(file => file.size > maxSizeMB * 1024 * 1024);
        if (largeFiles.length > 0) {
            setFileError(`Ukuran file tidak boleh lebih dari ${maxSizeMB}MB.`);
            e.target.value = '';
            return;
        }

        const nonImageFiles = selectedFiles.filter(file => !file.type.startsWith("image/"));
        if (nonImageFiles.length > 0) {
            setFileError("Hanya file gambar yang diizinkan.");
            e.target.value = '';
            return;
        }

        onFilesChange([...files, ...selectedFiles]);
        e.target.value = '';
    };

    const handleRemoveFile = (indexToRemove: number) => {
        onFilesChange(files.filter((_, index) => index !== indexToRemove));
    };

    const handleOpenPreview = (file: File) => {
        const fileUrl = URL.createObjectURL(file);
        setCurrentPreviewMedia({ url: fileUrl, type: 'image' });
        setPreviewModalOpen(true);
    };

    const handleClosePreview = () => {
        if (currentPreviewMedia) {
            URL.revokeObjectURL(currentPreviewMedia.url);
        }
        setPreviewModalOpen(false);
    };

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
        };
    }, [files]);

    return (
        <>
            <div className="mb-4">
                <Label className="block mb-2 text-sm">Foto (Opsional)</Label>
                {fileError && <p className="text-red-500 text-sm mb-2">{fileError}</p>}
                <div className="grid grid-cols-4 gap-2">
                    {files.map((file, index) => (
                        <div key={index} className="relative w-full aspect-square rounded-md overflow-hidden border group">
                            <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-full h-full object-cover cursor-pointer" onClick={() => handleOpenPreview(file)} />
                            {!disabled && (
                                <button type="button" onClick={() => handleRemoveFile(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Hapus file ${index + 1}`}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {files.length < maxFiles && !disabled && (
                        <label htmlFor="reviewMediaInput" className="flex items-center justify-center w-full aspect-square border-2 border-dashed rounded-md cursor-pointer hover:border-primary">
                            <Plus className="text-gray-400" />
                            <input type="file" id="reviewMediaInput" accept="image/*" multiple onChange={handleFileChange} className="hidden" disabled={disabled} />
                        </label>
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-500">Maks. {maxFiles} file, {maxSizeMB}MB per file.</p>
            </div>
            <MediaPreview open={previewModalOpen} onOpenChange={setPreviewModalOpen} media={currentPreviewMedia} />
        </>
    );
}

type StarRatingInputProps = {
    rating: number;
    onRatingChange: (rating: number) => void;
    disabled?: boolean;
};

export function StarRatingInput({ rating, onRatingChange, disabled = false }: StarRatingInputProps) {
    const [hover, setHover] = useState<number | null>(null);

    const handleMouseEnter = (star: number) => {
        if (!disabled) setHover(star);
    };

    const handleMouseLeave = () => {
        if (!disabled) setHover(null);
    };

    const handleClick = (star: number) => {
        if (!disabled) onRatingChange(star);
    };

    return (
        <div className="mb-4">
            <Label className="block mb-2 text-sm">Rating</Label>
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <i
                        key={star}
                        className={cn(
                            "fas fa-star text-2xl transition-transform duration-150 ease-in-out",
                            disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-125",
                            (hover ?? rating) >= star ? "text-yellow-400" : "text-gray-300"
                        )}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(star)}
                        aria-label={`Beri ${star} bintang`}
                    />
                ))}
            </div>
        </div>
    );
}