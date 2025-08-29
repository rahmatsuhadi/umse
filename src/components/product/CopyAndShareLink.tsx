"use client";

import { useState } from "react";
import { Copy, Share2, Twitter, Facebook, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

// Definisikan props untuk komponen, agar link produk bisa dinamis
interface ProductShareModalProps {
  productUrl: string;
  productName: string;
}

export function ProductShareModal({ productUrl, productName }: ProductShareModalProps) {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
  
  };

  // Enkode teks untuk URL
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(`Lihat produk menarik ini: ${productName}`);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    // instagram: `https://www.instagram.com/sharer/sharer.php?u=${encodedUrl}`
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bagikan Tautan Produk</DialogTitle>
          <DialogDescription>
            Siapapun yang memiliki tautan ini akan dapat melihat produk Anda.
          </DialogDescription>
        </DialogHeader>
        
        {/* Ikon Media Sosial */}
        <div className="flex justify-center space-x-4 py-4">
          <Link href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <FaFacebook className="h-6 w-6 text-blue-600" />
            </Button>
          </Link>
          <Link href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
             <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
               {/* Ganti dengan ikon X jika ada di library Anda, atau gunakan Twitter */}
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </Link>
          <Link href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <FaWhatsapp className="h-6 w-6 text-green-500" />
            </Button>
          </Link>
          
          {/* <Link href={shareLinks.instagram} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <FaInstagram className="h-6 w-6 text-red-500" />
            </Button>
          </Link> */}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={productUrl}
              readOnly
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopyToClipboard}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}