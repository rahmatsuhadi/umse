"use client"

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  id: string;
  path?: string;
  title: string;
};

export function ShareButtons({ title, id, path = "/literasi" }: Props) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setCurrentUrl(`${origin}${path}/` + id);
    }
  }, [path]);

  const copyToClipboard = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link behasil disalin!")
  };

  const encodedText = encodeURIComponent(`${title} - ${currentUrl}`);


  return (
    <div className="border-t border-slate-200 pt-6 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Bagikan Ini</h3>
      <div className="flex flex-wrap gap-3">
        {/* Facebook */}
        {/* <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentUrl
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-blue-300 text-white cursor-not-allowed"
          }`}
        >
          <FaFacebook size={16} className="mr-2" /> Facebook
        </a> */}

          {/* <FacebookShareButton url={"https://umse.vercel.app/produk/01991c6d-4cdc-70d6-a2f4-7eb88788caac"}/> */}

        {/* WhatsApp */}
        {/* <a
          href={`https://api.whatsapp.com/send?text=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentUrl
              ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
              : "bg-green-300 text-white cursor-not-allowed"
          }`}
        >
          <FaWhatsapp size={16} className="mr-2" /> WhatsApp
        </a> */}

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          disabled={!currentUrl}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentUrl
              ? "bg-slate-600 text-white hover:bg-slate-700 cursor-pointer"
              : "bg-slate-400 text-white cursor-not-allowed"
          }`}
        >
          <Copy size={16} className="mr-2" /> Salin Link
        </button>
      </div>
    </div>
  );
}
