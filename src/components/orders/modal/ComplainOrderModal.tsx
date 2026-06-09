import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Order } from "@/types";
import { useAddReport } from "@/features/reports/hook";
import { toast } from "sonner";

type Props = {
  open: boolean;
  order: Order | null;
  onClose: () => void;
};

export default function ComplainOrderModal({ open, order, onClose }: Props) {
  const [category, setCategory] = useState("product");
  const [desiredAction, setDesiredAction] = useState("refund");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const addReportMutation = useAddReport();

  if (!order) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setMediaPreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Judul komplain harus diisi");
      return;
    }

    if (!description.trim()) {
      toast.error("Deskripsi keluhan harus diisi");
      return;
    }

    addReportMutation.mutate(
      {
        title,
        description,
        category,
        media: mediaFiles,
        order_id: order.id,
        desired_action: desiredAction === "refund" ? "Pengembalian Dana" : desiredAction === "replacement" ? "Ganti Barang" : "Lainnya",
      },
      {
        onSuccess: () => {
          onClose();
          // Reset form fields
          setTitle("");
          setDescription("");
          setMediaFiles([]);
          setMediaPreviews([]);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-[var(--cream-dark)] p-7 shadow-xl"
        style={{
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <DialogHeader className="border-b border-[var(--cream-dark)] pb-4">
          <DialogTitle className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <i className="fas fa-exclamation-circle text-[var(--terracotta)] text-2xl"></i>
            Ajukan Komplain
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">
            Silakan ajukan keluhan Anda untuk pesanan #{order.order_number}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[var(--text-primary)] mb-1.5">
              Pilih Keluhan
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-[var(--cream-dark)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--terracotta)]"
            >
              <option value="product">Produk bermasalah / rusak / kurang</option>
              <option value="shipping">Pengiriman lambat / salah alamat</option>
              <option value="payment">Kendala Pembayaran</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[var(--text-primary)] mb-1.5">
              Tindakan yang Diinginkan
            </label>
            <select
              value={desiredAction}
              onChange={(e) => setDesiredAction(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-[var(--cream-dark)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--terracotta)]"
            >
              <option value="refund">Pengembalian Dana (Refund)</option>
              <option value="replacement">Ganti Barang / Kirim Ulang</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[var(--text-primary)] mb-1.5">
              Subjek Komplain
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Barang Rusak saat Pengiriman"
              className="w-full text-xs sm:text-sm bg-white border border-[var(--cream-dark)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--terracotta)]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[var(--text-primary)] mb-1.5">
              Deskripsi Keluhan secara Detail
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Jelaskan secara lengkap detail keluhan Anda..."
              className="w-full text-xs sm:text-sm bg-white border border-[var(--cream-dark)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--terracotta)]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[var(--text-primary)] mb-1.5">
              Foto Bukti Pendukung (Opsional)
            </label>
            <div className="flex flex-wrap gap-2.5 mt-2">
              {mediaPreviews.map((preview, i) => (
                <div key={i} className="relative w-16 h-16 border border-[var(--cream-dark)] rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt="preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 border-2 border-dashed border-[var(--cream-dark)] hover:border-[var(--terracotta)] rounded-lg flex flex-col items-center justify-center cursor-pointer transition">
                <i className="fas fa-plus text-[var(--text-muted)] text-sm"></i>
                <span className="text-[9px] text-[var(--text-muted)] mt-1">Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="border-t border-[var(--cream-dark)] pt-4 mt-6 gap-2">
            <DialogClose asChild>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={addReportMutation.isPending}
              >
                Batal
              </button>
            </DialogClose>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={addReportMutation.isPending}
            >
              {addReportMutation.isPending ? "Mengirim..." : "Kirim Komplain"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
