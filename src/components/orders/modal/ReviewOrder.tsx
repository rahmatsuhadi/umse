import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

import { MediaPreview } from '@/components/shared/MediaPreview';
import { Plus, X, FileText, Upload } from 'lucide-react';
import Image from "next/image";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ShippingItem } from "@/types";
import { useAddReview } from "@/features/reviews/hooks";

type ReviewModalOrderProps = {
    open: boolean;
    onClose: () => void;
    orderId: string;
    item: ShippingItem;
};

export function ReviewModalOrder({ open, onClose, orderId, item }: ReviewModalOrderProps) {
    const [rating, setRating] = useState(5); // Default to 5
    const [comment, setComment] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const { mutateAsync, isPending } = useAddReview(orderId);

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setRating(5);
            setComment("");
            setFiles([]);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            <DialogContent className="max-w-md bg-white border border-[var(--cream-dark)] p-6 shadow-xl" style={{ borderRadius: "var(--radius-lg)" }}>
                <DialogHeader className="border-b border-[var(--cream-dark)] pb-4">
                    <DialogTitle className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                        <i className="fas fa-pen-fancy text-[var(--terracotta)]"></i> Beri Ulasan
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="pt-4 space-y-5">
                    {/* Product Card */}
                    <div className="flex items-center gap-3.5 bg-[var(--cream)] border border-[var(--cream-dark)] p-3.5 rounded-[var(--radius-md)] hover:bg-white hover:border-[var(--terracotta-light)] hover:shadow-md transition-all duration-300">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-[var(--cream-dark)] bg-white shadow-xs">
                            <Image 
                                src={item.product ? item.product.thumbnail.media_url : '/assets/no-image.jpg'} 
                                alt="gambar" 
                                layout="fill" 
                                objectFit="cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-sm text-[var(--text-primary)] truncate mb-0.5">{item.product_name}</h4>
                            {item.variant_name && (
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--cream-dark)]/30 text-[var(--text-muted)] border border-[var(--cream-dark)]">
                                    {item.variant_name}
                                </span>
                            )}
                        </div>
                    </div>

                    <StarRatingInput rating={rating} onRatingChange={setRating} disabled={isPending} />

                    <div className="checkout-input-group">
                        <Label htmlFor="reviewComment" className="checkout-input-label">Komentar Ulasan</Label>
                        <div className="checkout-input-wrapper">
                            <FileText size={16} className="checkout-textarea-icon" />
                            <Textarea
                                id="reviewComment"
                                placeholder="Bagikan pengalaman Anda tentang produk ini (kualitas bahan, kesesuaian deskripsi, dll)..."
                                className="checkout-textarea"
                                style={{ minHeight: "100px" }}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <MediaUploader
                        files={files}
                        onFilesChange={setFiles}
                        maxFiles={4}
                        maxSizeMB={5}
                        disabled={isPending}
                    />

                    <DialogFooter className="border-t border-[var(--cream-dark)] pt-4 gap-2">
                        <DialogClose asChild>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={isPending}>
                                <X size={14} className="mr-1 inline animate-none" /> Batal
                            </button>
                        </DialogClose>
                        <button type="submit" className="btn btn-primary btn-sm flex items-center justify-center gap-1.5" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <i className="fas fa-spinner animate-spin"></i>
                                    <span>Mengirim...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i>
                                    <span>Kirim Ulasan</span>
                                </>
                            )}
                        </button>
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

        setFileError("");
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

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
        };
    }, [files]);

    return (
        <>
            <div className="mb-4">
                <Label className="checkout-input-label">Foto Produk (Opsional)</Label>
                {fileError && (
                    <div className="checkout-badge-alert py-1.5 px-3 rounded-xl mb-3 flex items-center gap-2">
                        <i className="fas fa-exclamation-circle text-xs"></i>
                        <span>{fileError}</span>
                    </div>
                )}
                <div className="grid grid-cols-4 gap-3">
                    {files.map((file, index) => (
                        <div key={index} className="relative w-full aspect-square rounded-[var(--radius-md)] overflow-hidden border border-[var(--cream-dark)] group shadow-xs">
                            <Image 
                                src={URL.createObjectURL(file)} 
                                alt={`Preview ${index}`} 
                                fill 
                                className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105" 
                                onClick={() => handleOpenPreview(file)} 
                            />
                            {!disabled && (
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveFile(index)} 
                                    className="absolute top-1 right-1 bg-black/60 hover:bg-[var(--terracotta)] text-white rounded-full p-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200" 
                                    aria-label={`Hapus file ${index + 1}`}
                                >
                                    <X size={10} />
                                </button>
                            )}
                        </div>
                    ))}
                    {files.length < maxFiles && !disabled && (
                        <label 
                            htmlFor="reviewMediaInput" 
                            className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-[var(--cream-dark)] rounded-[var(--radius-md)] cursor-pointer hover:border-[var(--terracotta)] hover:bg-[var(--cream)] transition-all duration-200 group"
                        >
                            <Upload className="text-[var(--text-muted)] group-hover:text-[var(--terracotta)] transition-colors mb-1" size={18} />
                            <span className="text-[10px] font-bold text-[var(--text-muted)] group-hover:text-[var(--terracotta)] transition-colors">Unggah</span>
                            <input type="file" id="reviewMediaInput" accept="image/*" multiple onChange={handleFileChange} className="hidden" disabled={disabled} />
                        </label>
                    )}
                </div>
                <p className="mt-2 text-[11px] text-[var(--text-muted)] font-medium">Maks. {maxFiles} file foto (JPG, PNG), maks. {maxSizeMB}MB per file.</p>
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

    const ratingLabels: Record<number, string> = {
        1: "Sangat Buruk",
        2: "Buruk",
        3: "Cukup",
        4: "Baik",
        5: "Sangat Puas"
    };

    const currentActiveRating = hover ?? rating;

    return (
        <div className="mb-4">
            <Label className="checkout-input-label">Rating Produk</Label>
            <div className="flex items-center gap-4 bg-[var(--cream)] border border-[var(--cream-dark)] p-3.5 rounded-[var(--radius-md)]">
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            disabled={disabled}
                            onMouseEnter={() => handleMouseEnter(star)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(star)}
                            className="focus:outline-none transition-transform duration-150 active:scale-90"
                            aria-label={`Beri ${star} bintang`}
                        >
                            <i
                                className={cn(
                                    "fas fa-star text-2xl transition-all duration-200",
                                    disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-125",
                                    currentActiveRating >= star 
                                        ? "text-[var(--saffron)] filter drop-shadow-[0_2px_4px_rgba(245,166,35,0.35)]" 
                                        : "text-[var(--cream-dark)]"
                                )}
                            />
                        </button>
                    ))}
                </div>
                <div className="flex-1 text-right">
                    <span className={cn(
                        "text-xs font-extrabold px-3 py-1.5 rounded-full inline-block transition-all duration-200",
                        currentActiveRating === 5 ? "bg-[var(--forest-light)]/10 text-[var(--forest-mid)]" :
                        currentActiveRating === 4 ? "bg-[var(--forest-light)]/10 text-[var(--forest-mid)] font-semibold" :
                        currentActiveRating === 3 ? "bg-[var(--saffron-light)]/10 text-[var(--saffron)]" :
                        "bg-[var(--terracotta-light)]/10 text-[var(--terracotta)]"
                    )}>
                        {ratingLabels[currentActiveRating] || ""}
                    </span>
                </div>
            </div>
        </div>
    );
}