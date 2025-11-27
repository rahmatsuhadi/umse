// components/FloatingWhatsApp.tsx

"use client";

import { useState } from "react";
import { Send } from "lucide-react";

// 1. Impor komponen yang relevan dari shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingWhatsApp() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "6282322798318"; // Ganti dengan nomor Anda

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setIsPopoverOpen(false); // Tutup popover setelah kirim
    setMessage("");
  };

  return (
    // 2. Gunakan komponen Popover sebagai wrapper utama
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      {/* Tombol FAB sekarang menjadi pemicu Popover */}
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-6 bg-green-500  hover:bg-green-600 right-6 z-[1001] md:h-16 md:w-16 w-12 h-12 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
          aria-label="Hubungi kami via WhatsApp"
        >
          <FaWhatsapp size={50} />
        </Button>
      </PopoverTrigger>

      {/* 3. Gunakan PopoverContent untuk menampilkan konten */}
      <PopoverContent
        side="top" // Muncul di atas tombol
        align="end" // Rata kanan dengan tombol
        className="w-80 mr-2 sm:mr-0 z-[1001]" // Beri sedikit margin agar tidak menempel di tepi layar mobile
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Kirim Pesan Cepat</h4>
            <p className="text-sm text-muted-foreground">
              Pesan Anda akan langsung dikirim ke WhatsApp kami.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message-popover" className="sr-only">
              Pesan
            </Label>
            <Textarea
              id="message-popover"
              placeholder="Ketik pesan Anda di sini..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button
            disabled={!!!message}
            onClick={handleSendMessage}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-600"
          >
            <Send size={18} className="mr-2" />
            Kirim via WhatsApp
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
